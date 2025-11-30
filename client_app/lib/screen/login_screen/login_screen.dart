import 'package:flutter/material.dart';
import '../../utility/app_color.dart';
import '../home_screen.dart';
import 'package:e_commerce_app/utility/extensions.dart';
import 'package:provider/provider.dart';
import '../../providers/language_provider.dart';
import '../../utility/translations.dart' as AppTranslations;

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  bool _isLogin = true;
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _usernameController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _toggleAuthMode() {
    setState(() {
      _isLogin = !_isLogin;
      _errorMessage = null;
    });
  }

  String? _validateEmail(String? value, String languageCode) {
    if (value == null || value.isEmpty) {
      return AppTranslations.Translations.get(
          'please_enter_email', languageCode);
    }
    final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!emailRegex.hasMatch(value)) {
      return AppTranslations.Translations.get(
          'please_enter_valid_email', languageCode);
    }
    return null;
  }

  String? _validatePassword(String? value, String languageCode) {
    if (value == null || value.isEmpty) {
      return AppTranslations.Translations.get(
          'please_enter_password', languageCode);
    }
    if (value.length < 6) {
      return AppTranslations.Translations.get(
          'password_min_length', languageCode);
    }
    return null;
  }

  String? _validateUsername(String? value, String languageCode) {
    if (value == null || value.isEmpty) {
      return AppTranslations.Translations.get(
          'please_enter_username', languageCode);
    }
    return null;
  }

  String? _validateConfirmPassword(String? value, String languageCode) {
    if (value == null || value.isEmpty) {
      return AppTranslations.Translations.get(
          'please_confirm_password', languageCode);
    }
    if (value != _passwordController.text) {
      return AppTranslations.Translations.get(
          'passwords_not_match', languageCode);
    }
    return null;
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      String? result;
      if (_isLogin) {
        final loginData = LoginData(
          name: _emailController.text.trim(),
          password: _passwordController.text,
        );
        result = await context.userProvider.login(loginData);
      } else {
        // Signup
        final signupData = SignupData(
          name: _usernameController.text.trim(),
          password: _passwordController.text,
          additionalSignupData: {
            'email': _emailController.text.trim(),
          },
        );
        result = await context.userProvider.register(signupData);

        if (result == null) {
          final loginData = LoginData(
            name: _emailController.text.trim(),
            password: _passwordController.text,
          );
          result = await context.userProvider.login(loginData);
        }
      }

      if (result == null && context.userProvider.getLoginUsr()?.sId != null) {
        if (mounted) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(
              builder: (context) => const HomeScreen(),
            ),
          );
        }
      } else {
        setState(() {
          _errorMessage = result ?? 'Operation failed. Please try again.';
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'An error occurred: $e';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return Scaffold(
      body: Container(
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFFf8f9fa),
              Color(0xFFe9ecef),
            ],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  SizedBox(height: size.height * 0.05),
                  // Logo
                  Image.asset(
                    'assets/images/logo.png',
                    height: 80,
                  ),
                  const SizedBox(height: 32),
                  // Title
                  Consumer<LanguageProvider>(
                    builder: (context, languageProvider, child) {
                      return Text(
                        _isLogin
                            ? AppTranslations.Translations.get('welcome_back',
                                languageProvider.currentLanguageCode)
                            : AppTranslations.Translations.get('create_account',
                                languageProvider.currentLanguageCode),
                        style: Theme.of(context)
                            .textTheme
                            .headlineMedium
                            ?.copyWith(
                              color: AppColor.darkGrey,
                              fontWeight: FontWeight.bold,
                            ),
                        textAlign: TextAlign.center,
                      );
                    },
                  ),
                  const SizedBox(height: 8),
                  Consumer<LanguageProvider>(
                    builder: (context, languageProvider, child) {
                      return Text(
                        _isLogin
                            ? AppTranslations.Translations.get(
                                'sign_in', languageProvider.currentLanguageCode)
                            : AppTranslations.Translations.get('sign_up',
                                languageProvider.currentLanguageCode),
                        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                              color: Colors.grey[600],
                            ),
                        textAlign: TextAlign.center,
                      );
                    },
                  ),
                  const SizedBox(height: 32),
                  // Form
                  Card(
                    elevation: 4,
                    surfaceTintColor: Colors.white,
                    color: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(24.0),
                      child: Form(
                        key: _formKey,
                        child: Column(
                          children: [
                            if (_errorMessage != null)
                              Container(
                                padding: const EdgeInsets.all(12),
                                margin: const EdgeInsets.only(bottom: 16),
                                decoration: BoxDecoration(
                                  color: Colors.red.shade50,
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: Colors.red.shade200,
                                  ),
                                ),
                                child: Text(
                                  _errorMessage!,
                                  style: TextStyle(
                                    color: Colors.red.shade700,
                                  ),
                                ),
                              ),

                            Consumer<LanguageProvider>(
                              builder: (context, languageProvider, child) {
                                return Column(
                                  children: [
                                    if (!_isLogin)
                                      TextFormField(
                                        controller: _usernameController,
                                        decoration: InputDecoration(
                                          labelText:
                                              AppTranslations.Translations.get(
                                                  'username',
                                                  languageProvider
                                                      .currentLanguageCode),
                                          hintText:
                                              AppTranslations.Translations.get(
                                                  'enter_username',
                                                  languageProvider
                                                      .currentLanguageCode),
                                          prefixIcon: const Icon(Icons.person),
                                          border: OutlineInputBorder(
                                            borderRadius:
                                                BorderRadius.circular(12),
                                          ),
                                          filled: true,
                                          fillColor: Colors.grey[50],
                                        ),
                                        validator: (value) => _validateUsername(
                                            value,
                                            languageProvider
                                                .currentLanguageCode),
                                        textInputAction: TextInputAction.next,
                                      ),
                                    if (!_isLogin) const SizedBox(height: 16),
                                    TextFormField(
                                      controller: _emailController,
                                      decoration: InputDecoration(
                                        labelText:
                                            AppTranslations.Translations.get(
                                                'email',
                                                languageProvider
                                                    .currentLanguageCode),
                                        hintText:
                                            AppTranslations.Translations.get(
                                                'enter_email',
                                                languageProvider
                                                    .currentLanguageCode),
                                        prefixIcon: const Icon(Icons.email),
                                        border: OutlineInputBorder(
                                          borderRadius:
                                              BorderRadius.circular(12),
                                        ),
                                        filled: true,
                                        fillColor: Colors.grey[50],
                                      ),
                                      validator: (value) => _validateEmail(
                                          value,
                                          languageProvider.currentLanguageCode),
                                      keyboardType: TextInputType.emailAddress,
                                      textInputAction: TextInputAction.next,
                                    ),
                                    const SizedBox(height: 16),
                                    TextFormField(
                                      controller: _passwordController,
                                      decoration: InputDecoration(
                                        labelText:
                                            AppTranslations.Translations.get(
                                                'password',
                                                languageProvider
                                                    .currentLanguageCode),
                                        hintText:
                                            AppTranslations.Translations.get(
                                                'enter_password',
                                                languageProvider
                                                    .currentLanguageCode),
                                        prefixIcon: const Icon(Icons.lock),
                                        border: OutlineInputBorder(
                                          borderRadius:
                                              BorderRadius.circular(12),
                                        ),
                                        filled: true,
                                        fillColor: Colors.grey[50],
                                      ),
                                      obscureText: true,
                                      validator: (value) => _validatePassword(
                                          value,
                                          languageProvider.currentLanguageCode),
                                      textInputAction: _isLogin
                                          ? TextInputAction.done
                                          : TextInputAction.next,
                                    ),
                                    if (!_isLogin) const SizedBox(height: 16),
                                    if (!_isLogin)
                                      TextFormField(
                                        controller: _confirmPasswordController,
                                        decoration: InputDecoration(
                                          labelText:
                                              AppTranslations.Translations.get(
                                                  'confirm_password',
                                                  languageProvider
                                                      .currentLanguageCode),
                                          hintText:
                                              AppTranslations.Translations.get(
                                                  'confirm_your_password',
                                                  languageProvider
                                                      .currentLanguageCode),
                                          prefixIcon:
                                              const Icon(Icons.lock_outline),
                                          border: OutlineInputBorder(
                                            borderRadius:
                                                BorderRadius.circular(12),
                                          ),
                                          filled: true,
                                          fillColor: Colors.grey[50],
                                        ),
                                        obscureText: true,
                                        validator: (value) =>
                                            _validateConfirmPassword(
                                                value,
                                                languageProvider
                                                    .currentLanguageCode),
                                        textInputAction: TextInputAction.done,
                                      ),
                                  ],
                                );
                              },
                            ),

                            const SizedBox(height: 24),

                            // Submit button
                            SizedBox(
                              width: double.infinity,
                              height: 50,
                              child: ElevatedButton(
                                onPressed: _isLoading ? null : _submit,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColor.darkOrange,
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  elevation: 2,
                                ),
                                child: Consumer<LanguageProvider>(
                                  builder: (context, languageProvider, child) {
                                    return _isLoading
                                        ? const CircularProgressIndicator(
                                            color: Colors.white,
                                          )
                                        : Text(
                                            _isLogin
                                                ? AppTranslations.Translations.get(
                                                        'login',
                                                        languageProvider
                                                            .currentLanguageCode)
                                                    .toUpperCase()
                                                : AppTranslations.Translations.get(
                                                        'sign_up',
                                                        languageProvider
                                                            .currentLanguageCode)
                                                    .toUpperCase(),
                                            style: const TextStyle(
                                              fontSize: 16,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          );
                                  },
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Toggle button
                  Consumer<LanguageProvider>(
                    builder: (context, languageProvider, child) {
                      return Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            _isLogin
                                ? AppTranslations.Translations.get(
                                    'dont_have_account',
                                    languageProvider.currentLanguageCode)
                                : AppTranslations.Translations.get(
                                    'already_have_account',
                                    languageProvider.currentLanguageCode),
                            style: TextStyle(
                              color: Colors.grey[700],
                            ),
                          ),
                          TextButton(
                            onPressed: _toggleAuthMode,
                            child: Text(
                              _isLogin
                                  ? AppTranslations.Translations.get('sign_up',
                                          languageProvider.currentLanguageCode)
                                      .toUpperCase()
                                  : AppTranslations.Translations.get('login',
                                          languageProvider.currentLanguageCode)
                                      .toUpperCase(),
                              style: const TextStyle(
                                color: AppColor.darkOrange,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class LoginData {
  final String name;
  final String password;

  LoginData({required this.name, required this.password});
}

class SignupData {
  final String name;
  final String password;
  final Map<String, String> additionalSignupData;

  SignupData({
    required this.name,
    required this.password,
    required this.additionalSignupData,
  });
}
