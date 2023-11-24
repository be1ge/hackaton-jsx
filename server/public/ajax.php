<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

add_action('wp_ajax_nopriv_login_user', 'login_user');
add_action('wp_ajax_nopriv_registration_user', 'registration_user');
add_action('wp_ajax_edit_account', 'edit_account');

function login_user(){
    header('Content-type: application/json');
    $json = array();

    if( !isset($_POST['email']) || !isset($_POST['pass']) ) wp_die();

    $infoUser = array();
    $infoUser['user_login'] = esc_html($_POST['email']);
    $infoUser['user_password'] = esc_html($_POST['pass']);
    $infoUser['remember'] = true;

    $json = wp_signon( $infoUser, false );

    if ( !is_wp_error($json) ) {
        $json = array('success' => true);
        echo json_encode( $json );

        wp_die();
    }
    
    if(isset($json->errors['empty_username'])) $json->errors['empty_username'] = 'Вы не ввели email';
    if(isset($json->errors['empty_password'])) $json->errors['empty_password'] = 'Вы не ввели пароль';
    if(isset($json->errors['invalid_username'])) $json->errors['invalid_username'] = 'Пользователь не найден';
    if(isset($json->errors['incorrect_password'])) $json->errors['incorrect_password'] = 'Неправильный пароль';
    if(isset($json->errors['invalid_email'])) $json->errors['invalid_email'] = 'Пользователь не найден';
    
    echo json_encode( $json );

    wp_die();
}

function registration_user(){
    header('Content-type: application/json');
    $json = array();

    if( !isset($_POST['email']) || !isset($_POST['pass']) || !isset($_POST['pass-repeat']) ) wp_die();

    if(empty($_POST['pass']) || strlen($_POST['pass']) < 4) {
        $json['errors']['incorrect_password'] = 'Пароль должен быть не менее 4 символов';
        echo json_encode($json);
        wp_die();
    }

    if($_POST['pass'] != $_POST['pass-repeat']) {
        $json['errors']['incorrect_password'] = 'Пароли не совпадают';
        echo json_encode($json);
        wp_die();
    }

    $json = wp_create_user( esc_html($_POST['email']), esc_html($_POST['pass']), esc_html($_POST['email']) );

    if (!is_wp_error( $json ) ) {
        $services = get_posts( array(
            'numberposts' => 100,
            'category'    => 0,
            'orderby'     => 'date',
            'order'       => 'DESC',
            'post_type'   => 'services',
            'suppress_filters' => true,
        )); 

        foreach($services as $key => $item){
            update_user_meta( $json, 'service_' . $item->ID, get_field('free_pages', 'option'));
        }

        wp_set_auth_cookie($json);

        $json = array('success' => true);

        echo json_encode( $json );
        wp_die();
    }
    
    if(isset($json->errors['empty_username'])) $json->errors['empty_username'] = 'Вы не ввели имя пользователя';
    if(isset($json->errors['empty_password'])) $json->errors['empty_password'] = 'Вы не ввели пароль';
    if(isset($json->errors['invalid_username'])) $json->errors['invalid_username'] = 'Пользователь не найден';
    if(isset($json->errors['incorrect_password'])) $json->errors['incorrect_password'] = 'Неправильный пароль';
    if(isset($json->errors['existing_user_email'])) $json->errors['existing_user_email'] = 'Email уже используется';
    if(isset($json->errors['existing_user_login'])) $json->errors['existing_user_login'] = 'Email уже используется';
    
    echo json_encode( $json );

    wp_die();
}

function edit_account(){
    header('Content-type: application/json');
    $json = array();

    if( !isset($_POST['pass']) || !isset($_POST['re-pass']) ) wp_die();

    $current_user = wp_get_current_user();

    if(empty($_POST['pass']) && empty($_POST['re-pass'])){
        $json['errors']['incorrect_password'] = 'Пароль не может быть пустым ';
        echo json_encode($json);
        wp_die();
    }

    if(strlen($_POST['pass']) < 4 ){
        $json['errors']['incorrect_password'] = 'Пароль должен быть не менее 4 символов';
        echo json_encode($json);
        wp_die();
    }
    
    if($_POST['pass'] == $_POST['re-pass']){
        wp_set_password(esc_html($_POST['pass']), $current_user->ID);
        wp_set_auth_cookie($current_user->ID, true);

        $json = array('success' => true);
        echo json_encode($json);
        wp_die();
    }else{
        $json['errors']['incorrect_password'] = 'Пароли не совпадают';
        echo json_encode($json);
        wp_die();
    }
 

    echo json_encode($json);
    wp_die();
}

add_action('wp_ajax_service_api', 'service_api');
function service_api(){

    $data = array();

    if (empty($_POST['num_available_pages'])) {
        $data['error'] = 'Превышен лимит страниц';
        wp_die(json_encode($data, JSON_UNESCAPED_UNICODE));
    }
    if (empty($_FILES)) wp_die('Файл не загружен');
    if (empty(get_current_user_id())) wp_die();

    $url = get_field('url_api', 'option');
    $method = $_POST['method'];
    $num_available_pages = $_POST['num_available_pages'];
    $dir = get_theme_file_path() . '/uploads/';
    $allowedExtensions = ['png', 'jpg', 'jpeg', 'pdf'];
    $limitBytes  = 1024 * 1024 * 8 * 2;

    foreach($_FILES as $key => $file){
    
        $fileInfo = pathinfo($file['name']);
        $newFileName = 'file_' . date("d_m_y") . '_' . mt_rand(100, 999) . '_' . count(scandir($dir)) . '.' . $fileInfo['extension'];
        $filePath =  $dir . $newFileName;
        $error = null;

        $data[$key]['name'] = $file['name'];
        $data[$key]['filename'] = $fileInfo['filename'];

        if ($file['size'] > $limitBytes) {
            $error = 'Размер файла слишком большой';
        } elseif (!in_array($fileInfo['extension'], $allowedExtensions)) {
            $error = 'Некорректный формат';
        } elseif ($file['error'] !== UPLOAD_ERR_OK) {
            $error = 'Ошибка при загрузке файла.';
        } elseif (file_exists($filePath)) {
            $error = 'Файл с таким именем уже существует';
        } elseif (!move_uploaded_file($file['tmp_name'], $filePath)) {
            $error = 'Ошибка при загрузке файла';
        }

        if(!empty($error)){
            $data[$key]['error'] = $error;
            continue;
        } 

        if($num_available_pages <= 0) { 
            $data[$key]['error'] = 'Превышен лимит страниц';
            continue;
        }

        $get = array(
            'num_available_pages'  => $num_available_pages,
        );

        $curl_file = curl_file_create($filePath, $file['type'] , $newFileName);

        $ch = curl_init($url . '/' . $method . '?' . http_build_query($get));
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, array('fl' => $curl_file));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_HEADER, false);
        $data[$key]['response'] = json_decode(curl_exec($ch), true);
        curl_close($ch);

        $data[$key]['pages_recognized'] = count($data[$key]['response']['text']);
        $num_available_pages -= count($data[$key]['response']['text']);

        unlink($filePath);
    }

    update_user_meta( get_current_user_id(), 'service_' . $_POST['method_id'], $num_available_pages );

    wp_die(json_encode($data));
}

add_action('wp_ajax_downloadFile', 'downloadFile');
function downloadFile(){
    if( !isset($_POST['text']) && empty($_POST['text']) ) wp_die();

    $data = array();
    $data['text'] = json_decode(stripcslashes(trim($_POST['text'], '\t')), true);
    wp_die(json_encode($data, JSON_PRETTY_PRINT));
}

add_action('wp_ajax_purchase_product', 'purchase_product');
add_action('wp_ajax_nopriv_purchase_product', 'for_unregistered_users');
function purchase_product(){

    $shop_id = get_field('shop_id', 'option');
    $secret_key = get_field('secret_key', 'option');
    $json = array();
    global $wpdb;

    require_once get_theme_file_path() . '/yookassa/autoload.php';

    if(empty($shop_id) || empty($secret_key) || !isset($_POST['package']) || !isset($_POST['price']) || !isset($_POST['quantity'])) wp_die();
    
    $price = $_POST['price'];
    $package = $_POST['package'];
    $quantity = $_POST['quantity'];

    $services = get_post($package);
    $infoUser = wp_get_current_user();

    $client = new \YooKassa\Client();
    $client->setAuth($shop_id, $secret_key);

    try {
        $response = $client->createPayment(
            array(
                'amount' => array(
                    'value' => $price,
                    'currency' => 'RUB',
                ),
                'confirmation' => array(
                    'type' => 'redirect',
                    'return_url' => get_home_url(),
                ),
                'capture' => true,
                'description' => $services->post_excerpt,
                'receipt' => array(
                    'customer' => array(
                        'full_name' => $infoUser->data->user_email,
                        'email' => $infoUser->data->user_email,
                        'phone' => $infoUser->data->user_email,
                    ),
                    'items' => array(
                        array(
                            'description' => $services->post_title . ' - ' . $quantity . ' шт.',
                            'amount' => array(
                                'value' => $price,
                                'currency' => 'RUB',
                            ),
                            'payment_subject' => 'service',
                            'payment_mode' => 'full_payment',
                            'vat_code' => 1,
                            'quantity' => 1
                        ),
                    )
                )
            ),
            gen_uuid()
        );

        $wpdb->query(
            $wpdb->prepare(
                "
                INSERT INTO transactions
                ( date, user, service_id, quantity, transactions_id, price, status )
                VALUES ( %s, %d, %d, %d, %s, %s, %s )
                ",
                $response->getCreatedAt()->format('Y-m-d H:i:s'),
                $infoUser->ID,
                $package,
                $quantity,
                $response->getId(),
                $price,
                $response->getStatus()
            )
        );

        $json['success_url'] = $response->getConfirmation()->getConfirmationUrl();
    } catch (\Exception $e) {
        $response = $e;
    }

    wp_die(json_encode($json));
}

function for_unregistered_users(){
    $json['redirect'] = get_site_url() . '/account';
    wp_die(json_encode($json));
}

function gen_uuid() {
	return sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
		mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),
		mt_rand( 0, 0xffff ),
		mt_rand( 0, 0x0fff ) | 0x4000,
		mt_rand( 0, 0x3fff ) | 0x8000,
		mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
	);
}
