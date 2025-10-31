class Catalogo:
    def __init__(self):
        self.productos = []
        self.bootcamp = {}

    def set_productos(self, productos):
        self.productos = productos or []

    def set_bootcamp(self, bootcamp):
        self.bootcamp = bootcamp or {}

    def listar_productos_paginados(self, pagina=1, por_pagina=10):
        if not self.productos:
            return "No hay productos cargados."

        total = len(self.productos)
        total_paginas = (total + por_pagina - 1) // por_pagina

        # Validar rango de página
        if pagina < 1 or pagina > total_paginas:
            return f"Página inválida. Solo hay {total_paginas} páginas."

        inicio = (pagina - 1) * por_pagina
        fin = inicio + por_pagina
        subset = self.productos[inicio:fin]

        lines = [f"🛍️ Productos (página {pagina}/{total_paginas}):"]
        for p in subset:
            nombre = p.get("nombre", "Sin nombre")
            precio = p.get("precio")
            precio_txt = f"${precio:,}".replace(",", ".") if precio is not None else "Consultar"
            url = p.get("url", "")
            url_txt = f" → {url}" if url else ""
            lines.append(f"- {nombre} — {precio_txt}{url_txt}")

        if pagina < total_paginas:
            lines.append("")
            lines.append(f"➡️ Para ver más, escribe: siguiente {pagina+1}")
        else:
            lines.append("")
            lines.append("✅ Fin del catálogo.")

        return "\n".join(lines)

    def detalle_item(self, nombre):
        n = nombre.strip().lower()
        for p in self.productos:
            if p.get("nombre", "").strip().lower() == n:
                precio = p.get("precio")
                desc = p.get("descripcion", "Sin descripción")
                url = p.get("url", "")
                precio_txt = f"${precio:,}".replace(",", ".") if precio is not None else "Consultar"
                extra = f"\nCompra: {url}" if url else ""
                return f"✅ {p['nombre']} — {precio_txt}\n{desc}{extra}"
        return "No encontré ese producto. Usa el nombre exacto como aparece en la tienda."

    def info_bootcamp(self):
        if not self.bootcamp:
            return "No hay información del Bootcamp cargada."
        titulo = self.bootcamp.get("titulo", "Bootcamp")
        descripcion = self.bootcamp.get("descripcion", "")
        incluye = self.bootcamp.get("incluye", "")
        bonos = self.bootcamp.get("bonos", "")
        instructores = self.bootcamp.get("instructores", "")
        url = self.bootcamp.get("url", "")
        url_line = f"\nReserva aquí: {url}" if url else ""
        return (
            f"🎓 {titulo}\n\n"
            f"{descripcion}\n\n"
            f"Incluye: {incluye}\n"
            f"Bonos: {bonos}\n"
            f"Instructores: {instructores}{url_line}"
        )