import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertEmailSchema } from "@shared/schema";

const addressClients = new Map<string, Set<WebSocket>>();

function notifyClients(address: string, event: string, data: any) {
  const clients = addressClients.get(address);
  if (clients) {
    const message = JSON.stringify({ event, data });
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws) => {
    let subscribedAddress: string | null = null;

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === "subscribe" && data.address) {
          subscribedAddress = data.address;
          if (!addressClients.has(subscribedAddress)) {
            addressClients.set(subscribedAddress, new Set());
          }
          addressClients.get(subscribedAddress)!.add(ws);
          ws.send(JSON.stringify({ event: "subscribed", address: subscribedAddress }));
        }
      } catch (e) {
        console.error("WebSocket message error:", e);
      }
    });

    ws.on("close", () => {
      if (subscribedAddress) {
        const clients = addressClients.get(subscribedAddress);
        if (clients) {
          clients.delete(ws);
          if (clients.size === 0) {
            addressClients.delete(subscribedAddress);
          }
        }
      }
    });
  });

  app.post("/api/address", (_req, res) => {
    const tempAddress = storage.createTempAddress();
    res.json(tempAddress);
  });

  app.get("/api/address/:address", (req, res) => {
    const { address } = req.params;
    const tempAddress = storage.getTempAddress(address);
    
    if (!tempAddress) {
      return res.status(404).json({ error: "Address not found" });
    }
    
    res.json(tempAddress);
  });

  app.get("/api/address/:address/emails", (req, res) => {
    const { address } = req.params;
    
    if (!storage.isAddressValid(address)) {
      return res.status(404).json({ error: "Address not found or expired" });
    }
    
    const emails = storage.getEmails(address);
    res.json(emails);
  });

  app.get("/api/address/:address/emails/:id", (req, res) => {
    const { address, id } = req.params;
    
    if (!storage.isAddressValid(address)) {
      return res.status(404).json({ error: "Address not found or expired" });
    }
    
    const email = storage.getEmail(address, id);
    if (!email) {
      return res.status(404).json({ error: "Email not found" });
    }
    
    storage.markAsRead(address, id);
    res.json(email);
  });

  app.delete("/api/address/:address/emails/:id", (req, res) => {
    const { address, id } = req.params;
    
    if (!storage.isAddressValid(address)) {
      return res.status(404).json({ error: "Address not found or expired" });
    }
    
    const deleted = storage.deleteEmail(address, id);
    if (!deleted) {
      return res.status(404).json({ error: "Email not found" });
    }
    
    notifyClients(address, "email_deleted", { id });
    res.json({ success: true });
  });

  app.post("/api/receive", (req, res) => {
    const parseResult = insertEmailSchema.safeParse(req.body);
    
    if (!parseResult.success) {
      return res.status(400).json({ error: "Invalid email data", details: parseResult.error });
    }
    
    const { to } = parseResult.data;
    
    if (!storage.isAddressValid(to)) {
      return res.status(404).json({ error: "Recipient address not found or expired" });
    }
    
    const email = storage.addEmail(parseResult.data);
    notifyClients(to, "new_email", email);
    
    res.json({ success: true, emailId: email.id });
  });

  app.post("/api/mailgun/webhook", (req, res) => {
    try {
      const recipient = req.body.recipient || req.body.To;
      const sender = req.body.sender || req.body.From || "unknown@unknown.com";
      const subject = req.body.subject || req.body.Subject || "(Sem assunto)";
      const textBody = req.body["body-plain"] || req.body["stripped-text"] || "";
      const htmlBody = req.body["body-html"] || req.body["stripped-html"] || "";

      if (!recipient) {
        console.log("Mailgun webhook: no recipient found", req.body);
        return res.status(200).send("OK");
      }

      if (!storage.isAddressValid(recipient)) {
        console.log("Mailgun webhook: address not valid or expired", recipient);
        return res.status(200).send("OK");
      }

      const email = storage.addEmail({
        to: recipient,
        from: sender,
        subject: subject,
        textBody: textBody,
        htmlBody: htmlBody,
      });

      notifyClients(recipient, "new_email", email);
      console.log("Mailgun webhook: email received for", recipient);
      
      res.status(200).send("OK");
    } catch (error) {
      console.error("Mailgun webhook error:", error);
      res.status(200).send("OK");
    }
  });

  return httpServer;
}
