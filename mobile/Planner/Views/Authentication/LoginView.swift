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
            .alert("Error", isPresented: .constant(viewModel.error != nil)) {
                Button("OK") {
                    viewModel.error = nil
                }
            } message: {
                if let error = viewModel.error {
                    Text(error.localizedDescription)
                }
            }
            .sheet(isPresented: $isRegistering) {
                RegistrationView()
            }
        }
    }
}
