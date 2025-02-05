/*
// Import logovacího systému
import { logger, LogLevel } from './logger';

// Nastavení globální úrovně logování pro celý projekt
logger.setGlobalLogLevel(LogLevel.DEBUG);

// Logování v souboru
logger.trace('This is a trace message');
logger.debug('This is a debug message');
logger.info('This is an info message');
logger.warn('This is a warn message');
logger.error('This is an error message');

// Můžete také nastavit úroveň logování pro specifický soubor
logger.setLogLevelForFile('ComponentA.ts', LogLevel.INFO);

// Tato zpráva bude vypsána pouze pokud je úroveň logování pro 'ComponentA.ts' >= INFO
logger.info('This is an info message in ComponentA', 'ComponentA.ts');
logger.debug('This debug message will not be shown for ComponentA', 'ComponentA.ts');
 */

// Definice úrovní logování
export enum LogLevel {
  ERROR = 1,
  WARN,
  INFO,
  DEBUG,
  TRACE // Přidání TRACE úrovně
}
class Logger {
  private static currentLevel: LogLevel = LogLevel.TRACE;
  private static fileLogLevels: Map<string, LogLevel> = new Map(); // Uloží loglevel pro jednotlivé soubory

  // Nastaví úroveň logování pro celý projekt
  public static setGlobalLogLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  // Nastaví úroveň logování pro specifický soubor
  public static setLogLevelForFile(fileName: string, level: LogLevel): void {
    this.fileLogLevels.set(fileName, level);
  }

  // Získá aktuální úroveň logování pro soubor (používá se souborová jména jako klíče)
  private static getLogLevelForFile(fileName: string): LogLevel {
    return this.fileLogLevels.get(fileName) ?? this.currentLevel;
  }

  // Extrahuje volající soubor a řádek ze stack trace
  private static getCallerInfo(): string {
    const error = new Error();
    const stackLines = error.stack?.split("\n") || [];
    //console.log(stackLines);
    // Hledáme první stack trace řádek, který není z Loggeru a není první (Error)
    const callerLine = stackLines.find(line =>
      !line.includes('Logger.ts') && !line.startsWith('Error')
    ) || '';

    if (callerLine) {
      // Odstranění parametrů (např. "t=1738716664621") z URL
      const match = callerLine.match(/at\s+(.*)\s\((.*):(\d+):(\d+)\)/) ||
        callerLine.match(/at\s+(.*):(\d+):(\d+)/);

      if (match) {
        let file = match[2] || match[1]; // Soubor
        const line = match[3]; // Číslo řádku

        // Odstraníme query string (např. ?t=1738716664621)
        file = file.replace(/\?.*$/, '');

        return `${file}:${line}`;
      }
    }
    return "unknown"; // Pokud se nepodaří extrahovat
  }


  // Hlavní funkce pro logování podle úrovně
  private static log(level: LogLevel, message: string, fileName: string, ...data: any[]): void {
    const currentLevel = this.getLogLevelForFile(fileName);
    const callerInfo = this.getCallerInfo(); // 🔥 Extrahujeme volající soubor a řádek

    if (level <= currentLevel) {
      const timestamp = new Date().toISOString();
      // const formattedMessage = `[${timestamp}] [${LogLevel[level]}] ${fileName}: ${message}`;
      const formattedMessage = `[${LogLevel[level]}] ${fileName}: ${message}`;
      if (level === LogLevel.TRACE) {
        console.trace(formattedMessage, callerInfo, ...data)
      }
      else if (level === LogLevel.DEBUG) {
        console.debug(formattedMessage, callerInfo, ...data);
      }
      else {
        console.log(formattedMessage, callerInfo, ...data);  // Vytiskne zprávu s daty
      }
    }
  }

  // Metody pro jednotlivé úrovně logování
  public static trace(message: string, fileName: string = 'default', ...data: any[]): void {
    this.log(LogLevel.TRACE, message, fileName, ...data);
  }

  public static debug(message: string, fileName: string = 'default', ...data: any[]): void {
    this.log(LogLevel.DEBUG, message, fileName, ...data);
  }

  public static info(message: string, fileName: string = 'default', ...data: any[]): void {
    this.log(LogLevel.INFO, message, fileName, ...data);
  }

  public static warn(message: string, fileName: string = 'default', ...data: any[]): void {
    this.log(LogLevel.WARN, message, fileName, ...data);
  }

  public static error(message: string, fileName: string = 'default', ...data: any[]): void {
    this.log(LogLevel.ERROR, message, fileName, ...data);
  }
}

// Export instanci loggeru pro použití v aplikaci
export const logger = Logger;