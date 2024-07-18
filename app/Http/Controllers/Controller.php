<?php

namespace App\Http\Controllers;

abstract class Controller
{
    // add your global variables here
    protected $database;

    protected $auth;

    public function __construct()
    {
        // add your global variables here
        $this->database = app('firebase.database');

        $this->auth = app('firebase.auth');
    }
}
