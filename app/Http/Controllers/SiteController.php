<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;


use App\Http\Facades\Auth;
use App\Http\Facades\Database;

class SiteController extends Controller
{

    public function index()
    {

        $employees = Database::getWhere('users', 'user_type', 'employee');
        return Inertia::render('Welcome/index', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'employees' => $employees
        ]);
    }

    public function get_employees()
    {
        $employees = Database::getWhere2('users', 'user_type', 'employee');
        return response()->json($employees);
    }

    public function get_patients()
    {
        $patients = Database::getWhere2('users', 'user_type', 'patient');
        return response()->json($patients);
    }


    // public function doctorList()
    // {

    //     $employees = Database::getWhere('users', 'user_type', 'employee');


    //     return Inertia::render('DoctorList/index', [
    //         'canLogin' => Route::has('login'),
    //         'canRegister' => Route::has('register'),
    //         'laravelVersion' => Application::VERSION,
    //         'phpVersion' => PHP_VERSION,
    //         'employees' => $employees
    //     ]);
    // }



}
