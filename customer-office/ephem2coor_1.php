<?php
/**
 * Created by PhpStorm.
 * User: a.zhakypov
 * Date: 11.11.2015
 * Time: 17:05
 */
define("a",6378.137);
define("f",298.257223563);
define("b",a*(1-1/f));
define("e1",(2-1/f)/f);
define("e2",a*a/b/b*e1);
define("w3",7.2921158553e-5);

function ephem2xyz($ephems,$t,&$I){
    $e = strtok($ephems," ");
    for($i=0;$i<4;$i++) {
        $e = strtok(" ");
    }
    $e = floatval($e);
    $I = deg2rad(floatval(strtok(" ")));
    $raan = fmod(deg2rad(floatval(strtok(" ")))-w3*$t,2*pi());
    //echo rad2deg($raan)."\n";
    $aofp = fmod(360+floatval(strtok(" ")),360);
    $ta = floatval(strtok(" "));
    $ra = floatval(strtok(" "));
    $alat = deg2rad(fmod($aofp+$ta,360));
    $r = $ra*(1-$e)/(1-$e*cos($ta));
    $cartcoor['x'] = $r*(cos($alat)*cos($raan)-sin($alat)*cos($I)*sin($raan));
    $cartcoor['y'] = $r*(cos($alat)*sin($raan)+sin($alat)*cos($I)*cos($raan));
    $cartcoor['z'] = $r*sin($alat)*sin($I);
    return $cartcoor;
}

function cart2geo($cart){
    $D = hypot($cart['x'],$cart['y']);
   // $p = hypot($D,$cart['z']);
    $r = sqrt($cart['z']*$cart['z']+(1-e1)*($cart['x']*$cart['x']+$cart['y']*$cart['y']));
    $B = atan($cart['z']*($r*$r*$r+b*e2*$cart['z']*$cart['z'])/$D/($r*$r*$r-b*e1*(1-e1)*$D*$D)); //formula Bouringa
   /* $B = $cart['z']/$D*(1+e2*b/$p);
    for($i=0;$i<2;$i++){
        $th = atan((1-1/f)*$B);
        $B = ($cart['z']+e2*b*pow(sin($th),3))/($D-e1*a*pow(cos($th),3));
    }
    $B = atan($B);*/
    $geo['lon'] = rad2deg(atan2($cart['y'],$cart['x']));
    $geo['h'] = $D/cos($B)-a/sqrt(1-e1*sin($B)*sin($B));
    $geo['lat'] = rad2deg($B);
    return $geo;
}

function angDist($a,$b){
    $phi[0] = deg2rad($a['lat']);
    $phi[1] = deg2rad($b['lat']);
    $lam = deg2rad($b['lon']-$a['lon']);
    $aD = acos(sin($phi[0])*sin($phi[1])+cos($phi[0])*cos($phi[1])*cos($lam));
    echo "AD = ".rad2deg($aD)."\n";
    return $aD;
}

function angAng($a,$b){
    $phi = deg2rad($b['lat']-$a['lat']);
    $lam = deg2rad($b['lon']-$a['lon']);
    $aA = atan2(sin($phi),sin($lam));
    echo "AA = ".rad2deg($aA)."\n";
    return $aA;
}

function acb($a,$b,$j){
    $ab = sin(angDist($a,$b));
    $cab = angAng($a,$b)+$j;
    $gamma['roll'] = asin($ab*cos($cab));
    $gamma['pitch'] = asin($ab*sin($cab));
    print_r($gamma);
    return $gamma;
}

function rA($B,$A){
    $N = a/sqrt(1-e1*sin($B)*sin($B));
    $rA = $N/(1+e2*cos($B)*cos($B)*sin($A)*sin($A));
    echo "rA = ".$rA."\n";
    return $rA;
}

function finAng($r,$g,$H){
    $alpha = atan($r*sin($g)/($H+$r*(1-cos($g))));
    return rad2deg($alpha);
}

//$ephemf = fopen("./ephemerids/EPHEMORB_DZHR_20151104000000_20151111000000.asc","r");
//$time = "11:00:0";
$date = date_create("2015-11-04T06:04:36.250Z");
$posixTime = date_timestamp_get($date)+0.25;
$startEphemDate = date_create();
$endEphemDate = date_create();
$i = 0;
do {
    $startEphem = $posixTime - $i*24*3600;
    $endEphem = $startEphem + 7*24*3600;
    date_timestamp_set($startEphemDate,$startEphem);
    date_timestamp_set($endEphemDate,$endEphem);
    $startEphem = date_format($startEphemDate,"Ymd");
    echo "startEphem = ".$startEphem."\n";
    $endEphem = date_format($endEphemDate,"Ymd");
    echo "endEphem = ".$endEphem."\n";
    $ephemf = @fopen("./ephemerids/EPHEMORB_DZHR_".$startEphem."000000_".$endEphem."000000.asc","r");
    $i++;
} while($ephemf==false && $i<7);
if($ephemf == false){
    echo "Necessary Ephemerids wasn't found!";
    exit(1);
}

$lam = fmod($posixTime,10);
if($lam>0){
    date_timestamp_set($date,$posixTime-$lam);
}
$time = date_format($date,"Y/m/d H:i:s");

$qlook['lat'] = (55.32110042067783+55.378723765389196)/2;
$qlook['lon'] = (77.96746767606707+77.63969298384167)/2;
echo $time."\n";

for($i=0;$i<3;$i++)
    fgets($ephemf);
do{
    $ephems=fgets($ephemf);
} while(strstr($ephems,$time)==0);
echo $ephems;

$time = date_timestamp_get($date);
date_time_set($date,12,5,13.6477);
date_date_set($date,2015,3,21);
$time-= date_timestamp_get($date);
echo $time."\n";
$cartcoor = ephem2xyz($ephems,$time,$I);
if($lam>0){
    $ephems=fgets($ephemf);
    $time+=10;
    $cartcoor1 = ephem2xyz($ephems,$time,$I);
    foreach(array_keys($cartcoor) as $x){
        $cartcoor[$x] = $lam/10*$cartcoor1[$x]+(1-$lam/10)*$cartcoor[$x];
    }
}

fclose($ephemf);
print_r($cartcoor);
$geo=cart2geo($cartcoor);
print_r($geo);
$gamma = acb($geo,$qlook,$I-pi()/2);
$r['roll'] = rA($geo['lat'],$I);
$r['pitch'] = rA($geo['lat'],$I+pi()/2);
$angOfShot['roll'] = finAng($r['roll'],$gamma['roll'],$geo['h']);
$angOfShot['pitch'] = -finAng($r['pitch'],$gamma['pitch'],$geo['h']);
print_r($angOfShot);
?>