//
//  AuthViewModel.swift
//  Planner
//
//  Created by Arthur de Jesus on 1/12/25.
//

import Foundation

@MainActor
class AuthViewModel: ObservableObject {
    @Published var isAuthenticated = false
    @Published var isLoading = false
    @Published var error: Error?
    
    func login(username: String, password: String) async {
        isLoading = true
        error = nil
        
        do {
            let response = try await APIClient.shared.login(username: username, password: password)
            AppState.shared.currentUser = response.user
            isAuthenticated = true
        } catch {
            self.error = error
        }
        
        isLoading = false
    }
    
    func register(username: String, password: String) async {
        isLoading = true
        error = nil
        
        do {
            let response = try await APIClient.shared.register(username: username, password: password)
            AppState.shared.currentUser = response.user
            isAuthenticated = true
        } catch {
            self.error = error
        }
        
        isLoading = false
    }
    
    func logout() async {
        isLoading = true
        
        do {
            try await APIClient.shared.logout()
            AppState.shared.currentUser = nil
            isAuthenticated = false
        } catch {
            // Even if logout fails, we'll clear local state
            AppState.shared.currentUser = nil
            isAuthenticated = false
            self.error = error
        }
        
        isLoading = false
    }
}
