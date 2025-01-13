//
//  LoginView.swift
//  Planner
//
//  Created by Arthur de Jesus on 1/12/25.
//

import SwiftUI

struct LoginView: View {
    @StateObject private var viewModel = AuthViewModel()
    @State private var username = ""
    @State private var password = ""
    @State private var isRegistering = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                Text("planner")
                    .font(.largeTitle)
                    .padding(.top, 50)
                
                VStack(spacing: 15) {
                    TextField("Username", text: $username)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .autocapitalization(.none)
                        .disabled(viewModel.isLoading)
                    
                    SecureField("Password", text: $password)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .disabled(viewModel.isLoading)
                }
                .padding(.horizontal)
                
                if viewModel.isLoading {
                    ProgressView()
                } else {
                    Button("Login") {
                        Task {
                            await viewModel.login(username: username, password: password)
                        }
                    }
                    .buttonStyle(.borderedProminent)
                    .disabled(username.isEmpty || password.isEmpty)
                    
                    Button("Create Account") {
                        isRegistering = true
                    }
                    .buttonStyle(.borderless)
                }
            }
            .padding()
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
            .sheet(isPresented: $isRegistering) {
                RegistrationView()
            }
        }
    }
}
