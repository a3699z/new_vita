<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use App\Http\Controllers\Controller;

use App\Http\Facades\Auth;
use App\Http\Facades\Database;

class ReservationController extends Controller
{

    public function index()
    {
        $reservations  = Database::getReferences('/reservations');
        $reservations = array_map(function ($item) {
            $item['employee'] = Auth::getUserData($item['employee_uid']);
            $item['user'] = Auth::getUserData($item['user_uid']);
            if (!empty($item['employee']) && !empty($item['user'])) {
                return $item;
            }
        }, $reservations);
        $reservations = array_filter($reservations);
        return view('admin.reservations.list', [
            'reservations' => $reservations,
            'emptyMessage' => 'No reservations found.'
        ]);
    }

    public function show (Request $request, $key)
    {
        $reservation = Database::getOneReference('/reservations/'.$key);
        $reservation = (object) $reservation;
        $reservation->employee = Auth::getUserData($reservation->employee_uid);
        $reservation->user = Auth::getUserData($reservation->user_uid);
        $employees = $this->database->getReference('/users')->orderByChild('user_type')->equalTo('employee')->getValue();
        return view('admin.reservations.detail', [
            'reservation' => $reservation,
            'employees' => $employees,
        ]);
    }

    public function delete (Request $request, $key)
    {
        Database::delete('/reservations/'.$key);
        return Redirect::route('admin.reservations');
    }

    public function update (Request $request, $key)
    {
        $data = $request->all();

        $reservation = Database::getOneReference('/reservations/'.$key);
        $data['updated_at'] = date('Y-m-d H:i:s');
        if (empty($data['status'])) {
            $data['status'] = 'pending';
        } else {
            $data['status'] = 'accepted';
        }



        if (!empty($data['employee_uid']) && $data['employee_uid'] != $reservation['employee_uid']) {
            $reservation['employee_uid'] = $data['employee_uid'];
            if ($this->reservation_exists($reservation)) {
                return Redirect::route('admin.reservations.show', ['key' => $key])->with('error', 'Employee is already reserved for this time.');
            }
        }



        Database::update('/reservations/'.$key, $data);

        return Redirect::route('admin.reservations.show', ['key' => $key]);
    }


    public function reservation_exists($reservation)
    {
        $uid = $reservation['employee_uid'];
        $blocked_hours = Database::get('users/'.$uid.'/blocked_hours/'.$reservation['date']);

        if (is_array($blocked_hours)) {
            if ($min = date('i', strtotime($reservation['hour'])) == '30') {
                if (in_array(date('H:i', strtotime($reservation['hour'] . ' -30 minutes')), $blocked_hours)) {
                    return true;
                }
            }
        }


        $reservations = Database::getWhere('reservations', 'employee_uid', $uid);

        foreach ($reservations as $res) {
            if ($res['date'] == $reservation['date'] && $res['hour'] == $reservation['hour']) {
                // dd($res);
                return true;
            }
            if ($min = date('i', strtotime($reservation['hour'])) == '30') {
                $hour = date('H:i', strtotime($reservation['hour'] . ' -30 minutes'));
                if ($res['date'] == $reservation['date'] && $res['hour'] == $hour && $res['is_online']) {
                    // dd($res);
                    return true;
                }
            }
        }

        return false;
    }
}
