
async function verDetalleProducto(id) {
    const p = await getData('productos', id);
    if (!p) return;

    // Llenar información general
    document.getElementById('detalleProductoNombre').textContent = p.nombre;
    document.getElementById('detalleProductoSku').textContent = p.sku || 'N/A';
    document.getElementById('detalleProductoCategoria').textContent = p.categoria || 'N/A';
    document.getElementById('detalleProductoPrecioCosto').textContent = formatearMoneda(p.precioCompra || 0);
    document.getElementById('detalleProductoPrecioRetail').textContent = formatearMoneda(p.precioVenta || 0);
    document.getElementById('detalleProductoDescripcion').textContent = p.descripcion || 'Sin descripción';

    // Imagen
    const imgSrc = p.imagen || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect fill='%23e9ecef' width='150' height='150'/%3E%3Ctext fill='%236c757d' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='14'%3ESin imagen%3C/text%3E%3C/svg%3E";
    document.getElementById('detalleProductoImagen').src = imgSrc;

    // Stock total
    document.getElementById('detalleProductoStockTotal').textContent = p.stock || 0;

    // Detalle del inventario
    document.getElementById('detalleStockActual').textContent = p.stock || 0;
    document.getElementById('detalleStockMinimo').textContent = p.stockMinimo || 0;

    // Estado
    const estadoBadge = document.getElementById('detalleEstado');
    if (p.stock <= 0) {
        estadoBadge.textContent = 'Agotado';
        estadoBadge.className = 'badge bg-danger';
    } else if (p.stock <= p.stockMinimo) {
        estadoBadge.textContent = 'Bajo Stock';
        estadoBadge.className = 'badge bg-warning text-dark';
    } else {
        estadoBadge.textContent = '✓ Normal';
        estadoBadge.className = 'badge bg-success';
    }

    // Mostrar modal
    new bootstrap.Modal(document.getElementById('modalDetalleProducto')).show();
}
