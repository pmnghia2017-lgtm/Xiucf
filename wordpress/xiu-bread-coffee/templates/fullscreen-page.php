<?php
/**
 * Fullscreen standalone landing template inside WordPress (avoids active WP theme CSS/header conflicts).
 */
if (!defined('ABSPATH')) {
    exit;
}

$bundle = xiu_get_bundle_assets();
$config_json = wp_json_encode(xiu_get_frontend_config());
$favicon_url = XIU_PLUGIN_URL . 'app/favicon.svg';
$og_image_url = XIU_PLUGIN_URL . 'app/assets/aistudio/image_bedee89f.png';
?>
<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?php echo esc_html(get_the_title() ?: 'Xíu Bread & Coffee — Bánh mì tươi · Cà phê thật · Thực phẩm sạch'); ?></title>
    <meta
      name="description"
      content="Chuỗi cửa hàng bánh mì tươi nướng mỗi ngày, cà phê rang xay nguyên chất và bánh ngọt thủ công. Flagship 179A Cách Mạng Tháng 8, P. Bàn Cờ, TP.HCM."
    />
    <meta property="og:title" content="Xíu Bread &amp; Coffee — Bánh mì tươi · Cà phê thật · Thực phẩm sạch" />
    <meta
      property="og:description"
      content="Chuỗi cửa hàng bánh mì tươi nướng mỗi ngày, cà phê rang xay nguyên chất và bánh ngọt thủ công tại TP.HCM."
    />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="<?php echo esc_url($og_image_url); ?>" />
    <link rel="icon" type="image/svg+xml" href="<?php echo esc_url($favicon_url); ?>" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <?php if (!empty($bundle['css'])) : ?>
      <link rel="stylesheet" crossorigin href="<?php echo esc_url($bundle['css']); ?>" />
    <?php endif; ?>
  </head>
  <body class="bg-[#FCFAF7] text-[#24140D] antialiased selection:bg-[#C67211]/20 selection:text-[#24140D]">
    <script>window.__XIU_WP_CONFIG__ = <?php echo $config_json; ?>;</script>
    <div id="xiu-bread-coffee-root"></div>
    <?php if (!empty($bundle['js'])) : ?>
      <script type="module" crossorigin src="<?php echo esc_url($bundle['js']); ?>"></script>
    <?php else : ?>
      <p style="padding: 2rem; font-family: sans-serif;">Chưa tìm thấy gói build React trong thư mục app/assets/.</p>
    <?php endif; ?>
  </body>
</html>
