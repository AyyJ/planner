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
    @Published var error: AuthenticationError?
    
    func login(username: String, password: String) async {
        isLoading = true
        error = nil
        
        do {
            let response = try await APIClient.shared.login(username: username, password: password)
            AppState.shared.currentUser = response.user
            isAuthenticated = true
        } catch let apiError as APIError {
            switch apiError {
            case .unauthorized:
                error = .invalidCredentials
            case .networkError:
                error = .networkError
            default:
                error = .unknown
            }
        } catch {
            self.error = .unknown
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
        } catch let apiError as APIError {
            switch apiError {
            case .serverError(let message):
                error = .registrationFailed(message: message)
            case .networkError:
                error = .networkError
            default:
                error = .unknown
            }
        } catch {
            self.error = .unknown
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
        }
        
        isLoading = false
    }
}
