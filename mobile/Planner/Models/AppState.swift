//
//  AppState.swift
//  Planner
//
//  Created by Arthur de Jesus on 1/12/25.
//

import Foundation

class AppState: ObservableObject {
    @Published var currentUser: User?
    @Published var isLoading = false
    @Published var error: String?
    
    static let shared = AppState()
    private init() {}
}
