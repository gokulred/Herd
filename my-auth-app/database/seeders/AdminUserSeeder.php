<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
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
        // Use firstOrCreate to prevent duplicate admin users
        $user = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Master Admin',
                'password' => Hash::make('password'),
                'account_type' => 'Individual',
                'is_admin' => true,
                'status' => 'approved',
            ]
        );

        // Get the "Admin" role, or create it if it doesn't exist
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);

        // Attach the role to the user if not already attached
        if (!$user->roles->contains($adminRole->id)) {
            $user->roles()->attach($adminRole->id);
        }
    }
}