<?php

use App\Http\Controllers\API\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\AdminAuthController;
use App\Http\Controllers\API\RoleController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/admin/login', [AdminAuthController::class, 'login']);


// Admin routes
Route::middleware(['auth:sanctum', 'role:Admin'])->prefix('admin')->group(function () {
    Route::get('/users', [AdminController::class, 'index']);
    Route::put('/users/{user}/approve', [AdminController::class, 'approve']);
    Route::put('/users/{user}/block', [AdminController::class, 'block']);
    Route::delete('/users/{user}', [AdminController::class, 'destroy']);
    Route::get('/roles', [RoleController::class, 'index']);
    Route::post('/users/{user}/roles', [RoleController::class, 'assignRole']);
    Route::delete('/users/{user}/roles/{role}', [RoleController::class, 'revokeRole']);
});

// Manager routes (example)
Route::middleware(['auth:sanctum', 'role:Manager'])->prefix('manager')->group(function () {
    Route::get('/dashboard', function () {
        return response()->json(['message' => 'Manager dashboard']);
    });
    // Add more manager-specific routes here
});

// Auditor routes (example)
Route::middleware(['auth:sanctum', 'role:Auditor'])->prefix('auditor')->group(function () {
    Route::get('/dashboard', function () {
        return response()->json(['message' => 'Auditor dashboard']);
    });
    // Add more auditor-specific routes here
});