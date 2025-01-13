//
//  RegistrationView.swift
//  Planner
//
//  Created by Arthur de Jesus on 1/12/25.
//

import SwiftUI

struct RegistrationView: View {
    @StateObject private var viewModel = AuthViewModel()
    @Environment(\.dismiss) private var dismiss
    
    @State private var username = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    
    var passwordsMatch: Bool {
        password == confirmPassword && !password.isEmpty
    }
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Account Details")) {
                    TextField("Username", text: $username)
                        .autocapitalization(.none)
                        .disabled(viewModel.isLoading)
                    
                    SecureField("Password", text: $password)
                        .disabled(viewModel.isLoading)
                    
                    SecureField("Confirm Password", text: $confirmPassword)
                        .disabled(viewModel.isLoading)
                }
                
                if !passwordsMatch && !password.isEmpty && !confirmPassword.isEmpty {
                    Text("Passwords don't match")
                        .foregroundColor(.red)
                }
                
                Section {
                    if viewModel.isLoading {
                        ProgressView()
                            .frame(maxWidth: .infinity)
                    } else {
                        Button("Create Account") {
                            Task {
                                await viewModel.register(username: username, password: password)
                            }
                        }
                        .disabled(!passwordsMatch || username.isEmpty)
                    }
                }
            }
            .navigationTitle("Create Account")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
            .alert(
               "Error",
               isPresented: Binding(
                   get: { viewModel.error != nil },
                   set: { if !$0 { viewModel.error = nil } }
               ),
               actions: {
                   Button("OK") {
                       viewModel.error = nil
                   }
               },
               message: {
                   if let error = viewModel.error as? APIError {
                       Text(error.userMessage)
                   } else {
                       Text(viewModel.error?.localizedDescription ?? "Unknown error")
                   }
               }
            )
        }
    }
}
