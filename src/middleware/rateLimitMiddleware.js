// Simple in-memory storage to track request counts
const requestCounts = new Map();

// Middleware for rate limiting
const rateLimitMiddleware = (req, res, next) => {
  const { ip } = req; // Use client's IP address as a unique identifier

  // Initialize request count for the client if not present
  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 0, lastTimestamp: Date.now() });
  }

  const clientInfo = requestCounts.get(ip);
  const { count, lastTimestamp } = clientInfo;
  const currentTime = Date.now();

  // Check if the client has exceeded the limit
  if (count >= 20 && currentTime - lastTimestamp < 10000) {
    // Limit exceeded, send a response
    return res.status(429).json({ message: "Rate limit exceeded" });
  }

  // Reset count if the last request was made more than 10 seconds ago
  if (currentTime - lastTimestamp >= 10000) {
    clientInfo.count = 0;
  }

  // Update request count and timestamp
  clientInfo.count += 1;
  clientInfo.lastTimestamp = currentTime;

  next();
};

module.exports = rateLimitMiddleware;
