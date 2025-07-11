<?php

use App\Http\Controllers\API\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\AdminAuthController;
use App\Http\Controllers\API\RoleController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/admin/login', [AdminAuthController::class, 'login']);


Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/users', [AdminController::class, 'index']);
    Route::put('/users/{user}/approve', [AdminController::class, 'approve']);
    Route::put('/users/{user}/block', [AdminController::class, 'block']);
    Route::delete('/users/{user}', [AdminController::class, 'destroy']);
});
Route::get('/roles', [RoleController::class, 'index']);
Route::post('/users/{user}/roles', [RoleController::class, 'assignRole']);
Route::delete('/users/{user}/roles/{role}', [RoleController::class, 'revokeRole']);