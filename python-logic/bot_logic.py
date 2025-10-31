class BotLogic:
    def __init__(self, catalogo):
        self.catalogo = catalogo
        self.stop_responses = False
        self.pagina_actual = 1

    def process_message(self, message: str) -> str:
        msg = message.strip().lower()

        # ✅ Reactivar el bot si el usuario lo solicita
        if msg in ["hola", "menu", "menú", "inicio"]:
            self.stop_responses = False
            self.pagina_actual = 1
            return (
                "👋 Bienvenido a Pieddy López Peinados.\n"
                "Opciones:\n"
                "1️⃣ Ver tienda (10 productos por página)\n"
                "2️⃣ Hablar con asesor\n"
                "3️⃣ Bootcamp Hair Styling Edition\n"
                "Escribe el número o la opción.\n\n"
                "💡 Navegación: después de ver la página 1, escribe 'siguiente' para ver más."
            )

        # ✅ Silencio total si el bot está apagado
        if self.stop_responses:
            return ""

        # ✅ Mostrar productos
        if msg in ["1", "tienda", "productos", "ver tienda"]:
            self.pagina_actual = 1
            return self.catalogo.listar_productos_paginados(1, 10)

        # ✅ Navegación por páginas
        if msg.startswith("siguiente"):
            partes = msg.split()
            if len(partes) == 2 and partes[1].isdigit():
                self.pagina_actual = int(partes[1])
            else:
                self.pagina_actual += 1
            return self.catalogo.listar_productos_paginados(self.pagina_actual, 10)

        # ✅ Apagar el bot
        if msg in ["2", "asesor", "hablar con asesor"]:
            self.stop_responses = True
            return (
                "🙋‍♀️ Un asesor te contactará pronto. El bot dejará de responder.\n"
                "👉 Si deseas volver a usar el bot, escribe: hola, menu, menú o inicio."
            )

        # ✅ Información del bootcamp
        if msg in ["3", "bootcamp"]:
            return self.catalogo.info_bootcamp()

        # ✅ Ver detalle de un producto
        if msg.startswith("ver "):
            nombre = msg[4:]
            return self.catalogo.detalle_item(nombre)

        # ❌ No hay mensaje genérico. Silencio si no se reconoce el comando.
        return ""