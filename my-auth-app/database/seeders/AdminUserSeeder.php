<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'Master Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'account_type' => 'Individual',
            'is_admin' => true,
            'status' => 'approved',
        ]);
    }
}