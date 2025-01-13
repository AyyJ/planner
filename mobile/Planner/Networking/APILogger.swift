//
//  APILogger.swift
//  Planner
//
//  Created by Arthur de Jesus on 1/12/25.
//

import Foundation

enum LogLevel {
    case debug
    case info
    case error
    
    var emoji: String {
        switch self {
        case .debug: return "🔍"
        case .info: return "ℹ️"
        case .error: return "❌"
        }
    }
}

class APILogger {
    static func log(_ level: LogLevel, _ message: String, error: Error? = nil, file: String = #file, line: Int = #line) {
        #if DEBUG
        let filename = (file as NSString).lastPathComponent
        let logMessage = "\(level.emoji) [\(filename):\(line)] \(message)"
        
        if let error = error {
            print("\(logMessage)\nError: \(error)")
            
            // Additional error details for network errors
            if let urlError = error as? URLError {
                print("Network Error Code: \(urlError.code.rawValue)")
                print("Description: \(urlError.localizedDescription)")
            }
        } else {
            print(logMessage)
        }
        #endif
    }
}
