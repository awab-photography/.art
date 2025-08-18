<?php
$file = "images.json";
if (!file_exists($file)) {
    file_put_contents($file, "[]");
}

$data = json_decode(file_get_contents($file), true);

// إضافة رابط صورة
if (isset($_POST["url"]) && $_POST["url"] !== "") {
    $url = $_POST["url"];
    if (!in_array($url, $data)) {
        $data[] = $url;
    }
}

// رفع صورة إلى مجلد images
if (isset($_FILES["file"]) && $_FILES["file"]["error"] === 0) {
    $targetDir = "images/";
    if (!is_dir($targetDir)) mkdir($targetDir);

    $fileName = time() . "_" . basename($_FILES["file"]["name"]);
    $targetFile = $targetDir . $fileName;

    if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFile)) {
        $url = $targetFile;
        if (!in_array($url, $data)) {
            $data[] = $url;
        }
    }
}

// حذف صورة
if (isset($_POST["delete"])) {
    $deleteUrl = $_POST["delete"];
    $data = array_values(array_filter($data, fn($img) => $img !== $deleteUrl));

    // إذا الصورة محلية نحذفها من السيرفر أيضاً
    if (file_exists($deleteUrl)) {
        unlink($deleteUrl);
    }
}

file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

echo json_encode(["success" => true, "data" => $data]);
?>
