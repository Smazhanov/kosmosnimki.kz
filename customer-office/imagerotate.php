<?php
	if (isset($_POST['qlUrl']) && isset($_POST['name']) && isset($_POST['degrees'])){
		$filename = $_POST['qlUrl'];
		$pathname = "./images/". $_POST['name'] .".png";
		$degrees = $_POST['degrees'];
		
		$source = imagecreatefrompng($filename);
		
		$pngTransparency = imagecolorallocatealpha($source , 0, 0, 0, 127);
		imagefill($source , 0, 0, $pngTransparency);
		$rotate = imagerotate($source, $degrees, $pngTransparency, 1);
		imagealphablending( $rotate, false );
		imagesavealpha( $rotate, true );
		header('Content-Type: image/png');
		imagepng($rotate, $pathname);
		$data = array();
		$data[0] = $pathname;
		header('Content-Type: application/json');
		echo json_encode($data);
		imagedestroy($source);
		imagedestroy($rotate);
	}
?>