//
//  ProfileView.swift
//  Planner
//
//  Created by Arthur de Jesus on 1/12/25.
//

import SwiftUI

struct ProfileView: View {
    @StateObject private var authViewModel = AuthViewModel()
    @State private var showingLogoutConfirmation = false
    
    var body: some View {
        NavigationView {
            List {
                if let user = AppState.shared.currentUser {
                    Section("Account") {
                        Text("Username: \(user.username)")
                    }
                }
                
                Section {
                    Button(role: .destructive) {
                        showingLogoutConfirmation = true
                    } label: {
                        HStack {
                            Text("Logout")
                            Spacer()
                            Image(systemName: "arrow.right.square")
                        }
                    }
                }
            }
            .alert(
                "Error",
                isPresented: Binding(
                    get: { authViewModel.error != nil },
                    set: { if !$0 { authViewModel.error = nil } }
                ),
                actions: {
                    Button("OK") {
                        authViewModel.error = nil
                    }
                },
                message: {
                    if let error = authViewModel.error as? APIError {
                        Text(error.userMessage)
                    } else {
                        Text(authViewModel.error?.localizedDescription ?? "Unknown error")
                    }
                }
            )
            .navigationTitle("Profile")
            .confirmationDialog(
                "Are you sure you want to logout?",
                isPresented: $showingLogoutConfirmation,
                titleVisibility: .visible
            ) {
                Button("Logout", role: .destructive) {
                    Task {
                        await authViewModel.logout()
                    }
                }
                Button("Cancel", role: .cancel) {}
            }
        }
    }
}
