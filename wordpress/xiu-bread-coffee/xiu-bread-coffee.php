<?php
/**
 * Plugin Name: Xíu Bread & Coffee Storefront
 * Description: Giao diện đặt món trực tuyến, tìm chi nhánh và tiếp nhận nhượng quyền cho Xíu Bread & Coffee — tích hợp lưu đơn hàng & hồ sơ vào WordPress Admin.
 * Version: 1.0.0
 * Author: Xíu Bread & Coffee
 * Text Domain: xiu-bread-coffee
 */

if (!defined('ABSPATH')) {
    exit;
}

define('XIU_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('XIU_PLUGIN_URL', plugin_dir_url(__FILE__));
define('XIU_FULLSCREEN_TEMPLATE_KEY', 'xiu-fullscreen-landing.php');

/**
 * Locate compiled Vite CSS and JS bundle files inside app/assets/.
 */
function xiu_get_bundle_assets() {
    $assets_dir = XIU_PLUGIN_DIR . 'app/assets/';
    $assets_url = XIU_PLUGIN_URL . 'app/assets/';
    $css_files = glob($assets_dir . 'index-*.css');
    $js_files  = glob($assets_dir . 'index-*.js');

    return array(
        'css' => !empty($css_files) ? $assets_url . basename($css_files[0]) : '',
        'js'  => !empty($js_files) ? $assets_url . basename($js_files[0]) : '',
    );
}

/**
 * Runtime configuration passed to the React frontend.
 */
function xiu_get_frontend_config() {
    return array(
        'assetBase' => untrailingslashit(XIU_PLUGIN_URL . 'app'),
        'apiBase'   => untrailingslashit(rest_url('xiu/v1')),
        'nonce'     => wp_create_nonce('wp_rest'),
    );
}

/**
 * Register Admin Menu & Custom Post Types for Orders and Franchise Inquiries.
 */
add_action('init', function () {
    register_post_type('xiu_order', array(
        'labels' => array(
            'name'          => 'Đơn hàng Xíu',
            'singular_name' => 'Đơn hàng',
            'menu_name'     => 'Đơn hàng',
        ),
        'public'              => false,
        'show_ui'             => true,
        'show_in_menu'        => 'xiu-storefront',
        'supports'            => array('title', 'editor'),
        'capability_type'     => 'post',
    ));

    register_post_type('xiu_inquiry', array(
        'labels' => array(
            'name'          => 'Nhượng quyền & B2B',
            'singular_name' => 'Hồ sơ hợp tác',
            'menu_name'     => 'Nhượng quyền & B2B',
        ),
        'public'              => false,
        'show_ui'             => true,
        'show_in_menu'        => 'xiu-storefront',
        'supports'            => array('title', 'editor'),
        'capability_type'     => 'post',
    ));
});

add_action('admin_menu', function () {
    add_menu_page(
        'Xíu Bread & Coffee',
        'Xíu Bread & Coffee',
        'manage_options',
        'xiu-storefront',
        'xiu_render_admin_guide_page',
        'dashicons-store',
        26
    );

    add_submenu_page(
        'xiu-storefront',
        'Hướng dẫn gắn trang',
        'Hướng dẫn gắn trang',
        'manage_options',
        'xiu-storefront',
        'xiu_render_admin_guide_page'
    );
});

function xiu_render_admin_guide_page() {
    $bundle = xiu_get_bundle_assets();
    ?>
    <div class="wrap">
        <h1>Xíu Bread &amp; Coffee — Cấu hình &amp; Triển khai</h1>
        <div class="card" style="max-width: 760px; padding: 16px 24px; margin-top: 16px;">
            <h2>Cách 1 (Khuyên dùng): Chạy toàn trang đẹp như bản gốc</h2>
            <ol>
                <li>Vào <strong>Trang (Pages) → Thêm mới (Add New)</strong>, đặt tiêu đề (ví dụ: <em>Trang chủ Xíu</em>).</li>
                <li>Ở cột phải mục <strong>Giao diện / Template (Page Attributes)</strong>, chọn: <code>Xíu Bread &amp; Coffee (Toàn màn hình)</code>.</li>
                <li>Bấm <strong>Đăng (Publish)</strong>, sau đó vào <strong>Cài đặt → Đọc (Settings → Reading)</strong> chọn trang này làm <em>Trang chủ tĩnh</em>.</li>
            </ol>

            <h2>Cách 2: Nhúng vào trang có sẵn bằng Shortcode</h2>
            <p>Chèn shortcode <code>[xiu_bread_coffee]</code> vào bất kỳ trang Elementor, Gutenberg hoặc Classic Editor nào.</p>

            <h2>Trạng thái gói build</h2>
            <p>
                JS Bundle: <?php echo $bundle['js'] ? '<code>Sẵn sàng</code>' : '<strong style="color:#b42318;">Chưa tìm thấy (hãy chạy npm run build:wp)</strong>'; ?><br>
                REST API Đơn hàng: <code><?php echo esc_html(rest_url('xiu/v1/orders')); ?></code><br>
                REST API Nhượng quyền: <code><?php echo esc_html(rest_url('xiu/v1/inquiries')); ?></code>
            </p>
        </div>
    </div>
    <?php
}

/**
 * Admin table columns for xiu_order.
 */
add_filter('manage_xiu_order_posts_columns', function ($columns) {
    return array(
        'cb'          => $columns['cb'],
        'title'       => 'Mã đơn',
        'xiu_cust'    => 'Khách hàng / SĐT',
        'xiu_branch'  => 'Chi nhánh',
        'xiu_mode'    => 'Hình thức',
        'xiu_total'   => 'Tổng tiền',
        'date'        => 'Thời gian',
    );
});

add_action('manage_xiu_order_posts_custom_column', function ($column, $post_id) {
    if ($column === 'xiu_cust') {
        echo esc_html(get_post_meta($post_id, '_xiu_customer_name', true) . ' · ' . get_post_meta($post_id, '_xiu_phone', true));
    } elseif ($column === 'xiu_branch') {
        echo esc_html(get_post_meta($post_id, '_xiu_branch_name', true));
    } elseif ($column === 'xiu_mode') {
        $mode = get_post_meta($post_id, '_xiu_fulfillment', true);
        echo $mode === 'delivery' ? 'Giao tận nơi' : 'Nhận tại quầy';
    } elseif ($column === 'xiu_total') {
        $total = intval(get_post_meta($post_id, '_xiu_total', true));
        echo '<strong>' . esc_html(number_format($total, 0, ',', '.')) . 'đ</strong>';
    }
}, 10, 2);

/**
 * Admin table columns for xiu_inquiry.
 */
add_filter('manage_xiu_inquiry_posts_columns', function ($columns) {
    return array(
        'cb'        => $columns['cb'],
        'title'     => 'Mã hồ sơ',
        'xiu_lead'  => 'Họ tên / Đơn vị',
        'xiu_area'  => 'Khu vực',
        'xiu_type'  => 'Hình thức quan tâm',
        'date'      => 'Thời gian',
    );
});

add_action('manage_xiu_inquiry_posts_custom_column', function ($column, $post_id) {
    if ($column === 'xiu_lead') {
        echo esc_html(get_post_meta($post_id, '_xiu_full_name', true) . ' · ' . get_post_meta($post_id, '_xiu_phone', true));
    } elseif ($column === 'xiu_area') {
        echo esc_html(get_post_meta($post_id, '_xiu_area', true));
    } elseif ($column === 'xiu_type') {
        $type = get_post_meta($post_id, '_xiu_inquiry_type', true);
        $map = array(
            'nhuong-quyen' => 'Nhượng quyền cửa hàng',
            'teabreak'     => 'Đặt tiệc Teabreak',
            'cung-cap-si'  => 'Cung cấp sỉ bánh mì',
        );
        echo esc_html(isset($map[$type]) ? $map[$type] : $type);
    }
}, 10, 2);

/**
 * Register WordPress REST API endpoints to persist Orders and Inquiries into WP Database + Email alert.
 */
add_action('rest_api_init', function () {
    register_rest_route('xiu/v1', '/orders', array(
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => function (WP_REST_Request $request) {
            $data = $request->get_json_params();
            $name = sanitize_text_field($data['customerName'] ?? '');
            $phone = sanitize_text_field($data['phone'] ?? '');
            $address = sanitize_text_field($data['address'] ?? '');
            $fulfillment = ($data['fulfillment'] ?? 'pickup') === 'delivery' ? 'delivery' : 'pickup';
            $branch_name = sanitize_text_field($data['branchName'] ?? '');
            $total = intval($data['total'] ?? 0);
            $items = is_array($data['items'] ?? null) ? $data['items'] : array();

            if (mb_strlen($name) < 2 || !preg_match('/^0\d{9,10}$/', preg_replace('/[\s.-]/', '', $phone))) {
                return new WP_REST_Response(array(
                    'success' => false,
                    'message' => 'Thông tin tên người nhận hoặc số điện thoại chưa hợp lệ.',
                ), 400);
            }

            if (empty($items)) {
                return new WP_REST_Response(array(
                    'success' => false,
                    'message' => 'Giỏ hàng đang trống.',
                ), 400);
            }

            $code = 'XIU-' . wp_rand(10000, 99999);
            $lines = array(
                "Mã đơn: {$code}",
                "Khách hàng: {$name}",
                "Điện thoại: {$phone}",
                "Chi nhánh: {$branch_name}",
                'Hình thức: ' . ($fulfillment === 'delivery' ? "Giao tận nơi ({$address})" : 'Nhận tại quầy'),
                'Tổng thanh toán: ' . number_format($total, 0, ',', '.') . 'đ',
                '',
                '--- Chi tiết món ---',
            );

            foreach ($items as $item) {
                $item_name = sanitize_text_field($item['name'] ?? '');
                $qty = max(1, intval($item['quantity'] ?? 1));
                $unit = intval($item['unitPrice'] ?? 0);
                $opts = is_array($item['options'] ?? null) ? array_map('sanitize_text_field', $item['options']) : array();
                $note = sanitize_text_field($item['note'] ?? '');
                $line = "- {$qty} × {$item_name} (" . number_format($unit * $qty, 0, ',', '.') . 'đ)';
                if (!empty($opts)) {
                    $line .= ' [' . implode(', ', $opts) . ']';
                }
                if ($note !== '') {
                    $line .= " — Ghi chú: {$note}";
                }
                $lines[] = $line;
            }

            $content = implode("\n", $lines);
            $post_id = wp_insert_post(array(
                'post_type'    => 'xiu_order',
                'post_status'  => 'publish',
                'post_title'   => $code . ' — ' . $name,
                'post_content' => $content,
            ));

            if (is_wp_error($post_id)) {
                return new WP_REST_Response(array(
                    'success' => false,
                    'message' => 'Không thể lưu đơn hàng vào cơ sở dữ liệu.',
                ), 500);
            }

            update_post_meta($post_id, '_xiu_order_code', $code);
            update_post_meta($post_id, '_xiu_customer_name', $name);
            update_post_meta($post_id, '_xiu_phone', $phone);
            update_post_meta($post_id, '_xiu_branch_name', $branch_name);
            update_post_meta($post_id, '_xiu_fulfillment', $fulfillment);
            update_post_meta($post_id, '_xiu_address', $address);
            update_post_meta($post_id, '_xiu_total', $total);

            wp_mail(
                get_option('admin_email'),
                "[Xíu Bread & Coffee] Đơn hàng mới {$code}",
                $content
            );

            return new WP_REST_Response(array(
                'success' => true,
                'code'    => $code,
                'postId'  => $post_id,
            ), 201);
        },
    ));

    register_rest_route('xiu/v1', '/inquiries', array(
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => function (WP_REST_Request $request) {
            $data = $request->get_json_params();
            $full_name = sanitize_text_field($data['fullName'] ?? '');
            $phone = sanitize_text_field($data['phone'] ?? '');
            $area = sanitize_text_field($data['area'] ?? '');
            $type = sanitize_text_field($data['inquiryType'] ?? 'nhuong-quyen');
            $notes = sanitize_textarea_field($data['notes'] ?? '');

            if (mb_strlen($full_name) < 2 || !preg_match('/^0\d{9,10}$/', preg_replace('/[\s.-]/', '', $phone))) {
                return new WP_REST_Response(array(
                    'success' => false,
                    'message' => 'Thông tin họ tên hoặc số điện thoại chưa hợp lệ.',
                ), 400);
            }

            $code = 'HT-' . wp_rand(10000, 99999);
            $content = implode("\n", array(
                "Mã hồ sơ: {$code}",
                "Họ tên / Đơn vị: {$full_name}",
                "Số điện thoại: {$phone}",
                "Khu vực: {$area}",
                "Hình thức quan tâm: {$type}",
                "Ghi chú: {$notes}",
            ));

            $post_id = wp_insert_post(array(
                'post_type'    => 'xiu_inquiry',
                'post_status'  => 'publish',
                'post_title'   => $code . ' — ' . $full_name,
                'post_content' => $content,
            ));

            if (is_wp_error($post_id)) {
                return new WP_REST_Response(array(
                    'success' => false,
                    'message' => 'Không thể lưu hồ sơ hợp tác.',
                ), 500);
            }

            update_post_meta($post_id, '_xiu_full_name', $full_name);
            update_post_meta($post_id, '_xiu_phone', $phone);
            update_post_meta($post_id, '_xiu_area', $area);
            update_post_meta($post_id, '_xiu_inquiry_type', $type);

            wp_mail(
                get_option('admin_email'),
                "[Xíu Bread & Coffee] Hồ sơ hợp tác mới {$code}",
                $content
            );

            return new WP_REST_Response(array(
                'success' => true,
                'code'    => $code,
                'postId'  => $post_id,
            ), 201);
        },
    ));
});

/**
 * Register Fullscreen Page Template in WordPress Page Attributes.
 */
add_filter('theme_page_templates', function ($templates) {
    $templates[XIU_FULLSCREEN_TEMPLATE_KEY] = 'Xíu Bread & Coffee (Toàn màn hình)';
    return $templates;
});

add_filter('template_include', function ($template) {
    if (is_page()) {
        $selected = get_page_template_slug(get_queried_object_id());
        if ($selected === XIU_FULLSCREEN_TEMPLATE_KEY) {
            return XIU_PLUGIN_DIR . 'templates/fullscreen-page.php';
        }
    }
    return $template;
}, 99);

/**
 * Shortcode [xiu_bread_coffee] for embedding inside existing WordPress pages.
 */
add_shortcode('xiu_bread_coffee', function () {
    $bundle = xiu_get_bundle_assets();
    if (!$bundle['js']) {
        return '<p>Không tìm thấy gói giao diện Xíu Bread &amp; Coffee.</p>';
    }

    wp_enqueue_style(
        'xiu-google-fonts',
        'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
        array(),
        null
    );

    if ($bundle['css']) {
        wp_enqueue_style('xiu-app-style', $bundle['css'], array(), '1.0.0');
    }

    $config_json = wp_json_encode(xiu_get_frontend_config());

    ob_start();
    ?>
    <script>window.__XIU_WP_CONFIG__ = <?php echo $config_json; ?>;</script>
    <div id="xiu-bread-coffee-root" class="xiu-wp-embed"></div>
    <script type="module" src="<?php echo esc_url($bundle['js']); ?>"></script>
    <?php
    return ob_get_clean();
});
