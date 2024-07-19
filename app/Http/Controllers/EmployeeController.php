<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;

use App\Http\Facades\Auth;
use App\Http\Facades\Database;


class EmployeeController extends Controller
{

    public function index (Request $request ) {
        // $employees = $this->database->getReference('/users')->orderByChild('user_type')->equalTo('employee')->getValue();
        $employees = Database::getWhere('users', 'user_type', 'employee');


        $dates = [];
        // one month early
        $date = date('Y-m-d');
        // the end  date after 14 days
        $end_date = date('Y-m-d', strtotime('+14 days', strtotime($date)));
        $germanDaysOfWeek = [
            'Sunday' => 'Sonntag',
            'Monday' => 'Montag',
            'Tuesday' => 'Dienstag',
            'Wednesday' => 'Mittwoch',
            'Thursday' => 'Donnerstag',
            'Friday' => 'Freitag',
            'Saturday' => 'Samstag'
        ];
        $germanMonths = [
            'January' => 'Januar',
            'February' => 'Februar',
            'March' => 'März',
            'April' => 'April',
            'May' => 'Mai',
            'June' => 'Juni',
            'July' => 'Juli',
            'August' => 'August',
            'September' => 'September',
            'October' => 'Oktober',
            'November' => 'November',
            'December' => 'Dezember'
        ];
        while (strtotime($date) <= strtotime($end_date)) {
            $dates[] = [
                'date' => $date,
                // 'day' => date('d M', strtotime($date)),
                'day' => date('d', strtotime($date)) . ' ' . $germanMonths[date('F', strtotime($date))],
                // 'weekday' => date('l', strtotime($date)),
                'weekday' => $germanDaysOfWeek[date('l', strtotime($date))],
                'type' => $request->type ?? 'online'
            ];
            $date = date('Y-m-d', strtotime($date . ' +1 day'));
        }

        return Inertia::render('DoctorList/index', [
            'employees' => $employees,
            'type' => $request->type ?? 'online',
            'dates' => $dates
        ]);
    }

    public function get_blocked_hours(Request $request, $uid) {
        $blocked_hours = Database::get('users/' . $uid . '/blocked_hours') ?? [];
        // dd($blocked_hours);
        $blocked = [];
        if (is_array($blocked_hours)) {
            foreach ($blocked_hours as $date => $hours) {
                if (is_array($hours)) {
                    foreach ($hours as $hour) {
                        $blocked[$date][] = $hour;
                        $blocked[$date][] = date('H:i', strtotime($hour . ' +15 minutes'));
                        $blocked[$date][] = date('H:i', strtotime($hour . ' +30 minutes'));
                        $blocked[$date][] = date('H:i', strtotime($hour . ' +45 minutes'));
                    }
                }
            }
        }
        $reservations = Database::getWhere('reservations', 'employee_uid', $uid);
        foreach ($reservations as $reservation) {
            $blocked[$reservation['date']][] = $reservation['hour'];
            if (!$reservation['is_online']) {
                // print_r($reservation);
                $blocked[$reservation['date']][] = date('H:i', strtotime($reservation['hour'] . ' +15 minutes'));
                $blocked[$reservation['date']][] = date('H:i', strtotime($reservation['hour'] . ' +30 minutes'));
                $blocked[$reservation['date']][] = date('H:i', strtotime($reservation['hour'] . ' +45 minutes'));
            } else {

                $blocked[$reservation['date']][] = date('H:i', strtotime($reservation['hour'] . ' +15 minutes'));
                $blocked[$reservation['date']][] = date('H:i', strtotime($reservation['hour'] . ' +30 minutes'));
            }
        }
        // dd($blocked);
        return response()->json($blocked);
    }

    public function get_days(Request $request, $uid, $type="online") {

        $dates = [];
        // one month early
        $date = date('Y-m-d');
        $end_date = date('Y-m-d', strtotime('+14 days', strtotime($date)));
        $germanDaysOfWeek = [
            'Sunday' => 'Sonntag',
            'Monday' => 'Montag',
            'Tuesday' => 'Dienstag',
            'Wednesday' => 'Mittwoch',
            'Thursday' => 'Donnerstag',
            'Friday' => 'Freitag',
            'Saturday' => 'Samstag'
        ];
        $germanMonths = [
            'January' => 'Januar',
            'February' => 'Februar',
            'March' => 'März',
            'April' => 'April',
            'May' => 'Mai',
            'June' => 'Juni',
            'July' => 'Juli',
            'August' => 'August',
            'September' => 'September',
            'October' => 'Oktober',
            'November' => 'November',
            'December' => 'Dezember'
        ];

        while (strtotime($date) <= strtotime($end_date)) {


            $blocked_hours = Database::get('users/' . $uid . '/blocked_hours/' . $date);
            $blocked = [];
            if (is_array($blocked_hours)) {
                foreach ($blocked_hours as $hour) {
                    $blocked[] = $hour;
                    $blocked[] = date('H:i', strtotime($hour . ' +15 minutes'));
                    $blocked[] = date('H:i', strtotime($hour . ' +30 minutes'));
                    $blocked[] = date('H:i', strtotime($hour . ' +45 minutes'));
                }
            }

            $dates[] = [
                'date' => $date,
                'day' => date('d', strtotime($date)) . ' ' . $germanMonths[date('F', strtotime($date))],
                'weekday' => $germanDaysOfWeek[date('l', strtotime($date))],
                'blocked_hours' => $blocked ?? []
            ];
            $date = date('Y-m-d', strtotime($date . ' +1 day'));
        }
        return response()->json($dates);
    }


    public function reservation_exists($reservation = []) {
        // $blocked_hours = $this->database->getReference('/users/'.$reservation['employee_uid'].'/blocked_hours/'.$reservation['date'])->getValue();
        $blocked_hours = Database::get('users/' . $reservation['employee_uid'] . '/blocked_hours/' . $reservation['date']);
        if (is_array($blocked_hours)) {
            if (in_array($reservation['hour'], $blocked_hours)) {
                return true;
            }
            if (date('i', strtotime($reservation['hour'])) == '15') {
                if (in_array(date('H:i', strtotime($reservation['hour'] . ' -15 minutes')), $blocked_hours)) {
                    return true;
                }
            } elseif (date('i', strtotime($reservation['hour'])) == '30') {
                if (in_array(date('H:i', strtotime($reservation['hour'] . ' -30 minutes')), $blocked_hours)) {
                    return true;
                }
            } elseif (date('i', strtotime($reservation['hour'])) == '45') {
                if (in_array(date('H:i', strtotime($reservation['hour'] . ' -45 minutes')), $blocked_hours)) {
                    return true;
                }
            }

        }
        return false;
    }
    /**
     * store employee
     */

    //  return array json of employees
    public function search(Request $request): JsonResource
    {
        $employees = new User();
        $employees = $employees->searchEmployeeByName($request->search);
        return new JsonResource($employees);
    }

    /**
     * show employee
     */
    public function show(Request $request, $uid)
    {
        $employee = Auth::getUserData($uid);
        if (!$employee) {
            return Redirect::route('site.index');
        }
        $avialable_dates = [];

        $dates = [];
        // one month early
        $date = date('Y-m-d');
        // the end  date after 14 days
        $end_date = date('Y-m-d', strtotime('+14 days', strtotime($date)));
        $germanDaysOfWeek = [
            'Sunday' => 'Sonntag',
            'Monday' => 'Montag',
            'Tuesday' => 'Dienstag',
            'Wednesday' => 'Mittwoch',
            'Thursday' => 'Donnerstag',
            'Friday' => 'Freitag',
            'Saturday' => 'Samstag'
        ];
        $germanMonths = [
            'January' => 'Januar',
            'February' => 'Februar',
            'March' => 'März',
            'April' => 'April',
            'May' => 'Mai',
            'June' => 'Juni',
            'July' => 'Juli',
            'August' => 'August',
            'September' => 'September',
            'October' => 'Oktober',
            'November' => 'November',
            'December' => 'Dezember'
        ];
        while (strtotime($date) <= strtotime($end_date)) {
            $dates[] = [
                'date' => $date,
                // 'day' => date('d M', strtotime($date)),
                'day' => date('d', strtotime($date)) . ' ' . $germanMonths[date('F', strtotime($date))],
                // 'weekday' => date('l', strtotime($date)),
                'weekday' => $germanDaysOfWeek[date('l', strtotime($date))],
                'type' => $request->type ?? 'online'
            ];
            $date = date('Y-m-d', strtotime($date . ' +1 day'));
        }


        $date = date('Y-m-d');
        $data = $this->quick_hour($date, $uid);
        if (!empty($data['hour'])) {
            $employee['quick_date'] = $data['date'];
            $employee['quick_hour'] = $data['hour'];

        }

        return Inertia::render('Employee/index', [
            'employee' => $employee,
            'dates' => $dates,
            'type' => $request->type ?? 'online'
        ]);

    }


    public function available_dates($employee_uid) {
        $employee = Auth::getUserData($employee_uid);
        if (!$employee) {
            return Redirect::route('site.index');
        }
        $avialable_dates = [];

        $dates = [];
        // one month early
        $date = date('Y-m-d');
        $end_date = date('Y-m-d', strtotime('+1 month', strtotime($date)));
        $germanDaysOfWeek = [
            'Sunday' => 'Sonntag',
            'Monday' => 'Montag',
            'Tuesday' => 'Dienstag',
            'Wednesday' => 'Mittwoch',
            'Thursday' => 'Donnerstag',
            'Friday' => 'Freitag',
            'Saturday' => 'Samstag'
        ];
        $germanMonths = [
            'January' => 'Januar',
            'February' => 'Februar',
            'March' => 'März',
            'April' => 'April',
            'May' => 'Mai',
            'June' => 'Juni',
            'July' => 'Juli',
            'August' => 'August',
            'September' => 'September',
            'October' => 'Oktober',
            'November' => 'November',
            'December' => 'Dezember'
        ];
        while (strtotime($date) <= strtotime($end_date)) {
            $dates[] = [
                'date' => $date,
                'day' => date('d', strtotime($date)) . ' ' . $germanMonths[date('F', strtotime($date))],
                'weekday' => $germanDaysOfWeek[date('l', strtotime($date))],
            ];
            $date = date('Y-m-d', strtotime($date . ' +1 day'));
        }

        return $dates;

        // dd($dates);
    }

    public function quick_hour($date, $uid) {
        $start_hour = '08:00';
        $end_hour = '15:00';
        if (strtotime(date('H:i')) > strtotime('15:00')) {
            $date = date('Y-m-d', strtotime($date . ' +1 day'));
        }
        $hour = '';
        // dd($date, $hour, $end_hour);
        $reservations = Database::getWhere('reservations', 'employee_uid', $uid);
        while (strtotime($start_hour) <= strtotime($end_hour)) {
            $isBooked = false;

            foreach ($reservations as $reservation) {
                if ($reservation['date'] == $date && $reservation['hour'] == $start_hour) {
                    $isBooked = true;
                    break;
                }
            }
            if ($isBooked) {
                $start_hour = date('H:i', strtotime($start_hour . ' +60 minutes'));
            } else {
                $hour = $start_hour;
                break;
            }
        }
        if (empty($hour)) {
            $hour = $this->quick_hour(date('Y-m-d', strtotime($date . ' +1 day')), $uid);
        }
        return array(
            'hour' => $hour,
            'date' => $date
        );
    }
    /**
     * check reservation
     */
    public function check(Request $request): RedirectResponse
    {
        $employee = User::find($request->employee_id);
        if (Auth::check()) {
            setcookie('employee_id', $employee->id, time() + (86400 * 30), "/");
            setcookie('date', $request->date, time() + (86400 * 30), "/");
            setcookie('hour', $request->hour, time() + (86400 * 30), "/");
            return Redirect::route('reservation.create');
        } else {
            return Redirect::route('login', ['redirect_url' => 'reservations.create']);
        }
    }

    /**
     * get all employees
     */
    public function getEmployees(): JsonResource
    {
        $employees = User::where('user_type', 'employee')->get();
        return new JsonResource($employees);
    }


}
