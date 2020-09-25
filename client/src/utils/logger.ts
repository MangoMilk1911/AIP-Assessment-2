import winston from "winston";

// Setup logging
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  const formattedTime = timestamp.replace(/T/, " ").replace(/\..+/, "");
  return `[${formattedTime}] ${level}: ${message}`;
});

winston.addColors({
  error: "red",
  info: "cyan",
});

// Only log to console in dev
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        customFormat
      ),
    })
  );
}

export default logger;
