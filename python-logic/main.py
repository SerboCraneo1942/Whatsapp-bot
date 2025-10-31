from catalogo import Catalogo
from bot_logic import BotLogic
#from whatsapp import WhatsAppAPI
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')


def run_bot():
    # Inicializar catálogo
    catalogo = Catalogo()

    # ✅ Productos reales de tus capturas
    catalogo.set_productos([
        {"nombre": "Baby pins x30", "precio": 3000, "descripcion": " ", "url": "https://pieddyloperapeinados.com.co/product/bobby-pins-x30"},
        {"nombre": "Baby pins dorado grande x12", "precio": 4000, "descripcion": "", "url": "https://pieddyloperapeinados.com.co/product/bobby-pins-dorado-grande-x12"},
        {"nombre": "Baby pins dorado pequeño x12", "precio": 3000, "descripcion": "", "url": "https://pieddyloperapeinados.com.co/product/bobby-pins-dorado-pequeno-x12"},
        {"nombre": "Baby pins negro grande x12", "precio": 4000, "descripcion": "", "url": "https://pieddyloperapeinados.com.co/product/bobby-pins-negro-grande-x12"},
        {"nombre": "Cepillo Decodificador", "precio": 35000, "descripcion": "Cepillo Decodificador Profesional. Ligero, versátil y perfecto para trabajar con secador. Su diseño ventilado permite una mejor circulación del aire, reduciendo el tiempo de secado y cuidando la fibra capilar. Las púas con punta redondeada desenredan sin maltratar, ideales para dar forma, volumen o alisar de forma suave. Un esencial diario en todo salón.", "url": "https://pieddyloperapeinados.com.co/product/cepillo-decodificador"},
        {"nombre": "Cepillo Pulidor", "precio": 5000, "descripcion": "", "url": "https://pieddyloperapeinados.com.co/product/cepillo-pulidor"},
        {"nombre": "Dona Rubia", "precio": 5000, "descripcion": "", "url": "https://pieddyloperapeinados.com.co/product/dona-rubia"},
        {"nombre": "Fusion Mask Vella", "precio": 125000, "descripcion": "Redescubrí el poder de la hidratación con Fusion Mask de Vella, una mascarilla facial de lujo diseñada para revitalizar, nutrir y transformar tu piel desde la primera aplicación. Gracias a su innovadora fórmula fusionada con ingredientes activos de alta eficacia, esta mascarilla trabaja intensamente para mejorar la elasticidad, aportar firmeza y dejar un acabado radiante y saludable.", "url": "https://pieddyloperapeinados.com.co/product/fusion-mask-vella"},
        {"nombre": "Gancho abierto dorado pequeño x12", "precio": 4000, "descripcion": "", "url": "https://pieddyloperapeinados.com.co/product/gancho-abierto-dorado-pequeno-x12"},
        {"nombre": "Gancho abierto negro pequeño x12", "precio": 4000, "descripcion": "", "url": "https://pieddyloperapeinados.com.co/product/gancho-abierto-negro-pequeno-x12"},
        {"nombre": "Ligas de Colores", "precio": 5000, "descripcion": "", "url": "https://pieddyloperapeinados.com.co/product/ligas-de-colores"},
        {"nombre": "Magistral Powder Style and Volume", "precio": 72000, "descripcion": "", "url": "https://pieddyloperapeinados.com.co/product/magistral-powder-style-and-volume"},
        {"nombre": "Magistral Thermoprotector 250ml", "precio": 85000, "descripcion": "", "url": "https://pieddyloperapeinados.com.co/product/magistral-thermoprotector-250ml"},
        {"nombre": "Magistral Waves 250ml", "precio": 85000, "descripcion": "", "url": "https://pieddyloperapeinados.com.co/product/magistral-waves-250ml"},
        {"nombre": "Magistral Wax Stick", "precio": 55000, "descripcion": "", "url": "https://pieddyloperapeinados.com.co/product/magistral-wax-stick"},
        {"nombre": "OSIS+ Air Whip 200ml", "precio": 75300, "descripcion": "Protección térmica pro al instante. OSiS+ Flatliner es el spray ideal para alisar, controlar el frizz y proteger el cabello del calor de planchas o secadores hasta 230 °C. Deja el cabello suave, brillante y con un acabado duradero, perfecto para peinados pulidos y definidos.", "url": "https://pieddyloperapeinados.com.co/product/osis-air-whip-200ml"},
        {"nombre": "OSIS+ Flatliner 200ml", "precio": 85700, "descripcion": "Protección térmica pro al instante. OSiS+ Flatliner es el spray ideal para alisar, controlar el frizz y proteger el cabello del calor de planchas o secadores hasta 230 °C. Deja el cabello suave, brillante y con un acabado duradero, perfecto para peinados pulidos y definidos.", "url": "https://pieddyloperapeinados.com.co/product/osis-flatliner-200ml"},
        {"nombre": "OSIS+ Hairbody 200ml", "precio": 79000, "descripcion": "Ligerísimo, pero con mucho poder. OSiS+ Hairbody es un spray acondicionador sin enjuague que aporta cuerpo, suavidad y manejabilidad al instante. Ideal para preparar el cabello antes del secado y facilitar el peinado, sin apelmazar ni dejar residuos. Perfecto para bases ligeras con control profesional.", "url": "https://pieddyloperapeinados.com.co/product/osis-hairbody-200ml"},
        {"nombre": "OSIS+ Session 300ml", "precio": 85700, "descripcion": "Fijación que no se rinde. OSiS+ Session es una laca de alta fijación que controla el peinado incluso en condiciones de humedad, sin apelmazar ni dejar residuos. Ideal para looks duraderos, definidos y con acabado profesional. ¡El toque final que todo peinador necesita!", "url": "https://pieddyloperapeinados.com.co/product/osis-session-300ml"},
        {"nombre": "OSIS+ Sparkler 300ml", "precio": 85900, "descripcion": "Brillo al instante. OSiS+ Sparkler es un spray de acabado que desenreda, suaviza y aporta un brillo espectacular sin apelmazar. Perfecto para dar ese toque final luminoso y sedoso en cualquier peinado. ¡Ideal para impresionar en cada sesión!", "url": "https://pieddyloperapeinados.com.co/product/osis-sparkler-300ml"},
        {"nombre": "OSIS+ Thrill 100ml", "precio": 83000, "descripcion": "Textura con actitud. OSiS+ Thrill es una fibra elástica moldeadora que permite crear estilos definidos, con control y movimiento. Ideal para esculpir peinados creativos con acabado brillante y flexible. ¡Perfecta para jugar con la forma sin perder fijación!", "url": "https://pieddyloperapeinados.com.co/product/osis-thrill-100ml"},
        {"nombre": "OSIS+ Velvet 200ml", "precio": 85000, "descripcion": "Suavidad de lujo al tacto. OSiS+ Velvet es un spray de textura con acabado terciopelo que brinda control suave, definición y un brillo natural. Ideal para looks elegantes, pulidos o despeinados con estilo. ¡Perfecto para crear texturas profesionales sin rigidez ni frizz!", "url": "https://pieddyloperapeinados.com.co/product/osis-velvet-200ml"},
        {"nombre": "Peinilla de Cardado y Diseño", "precio": 25000, "descripcion": "Domina el volumen y la textura con precisión profesional. Nuestra peinilla de diseño y cardado es ideal para crear peinados estructurados, recogidos con cuerpo y looks con altura. Sus cerdas resistentes y mango ergonómico ofrecen control total sin maltratar el cabello. Imprescindible en el kit de todo estilista.", "url": "https://pieddyloperapeinados.com.co/product/peinilla-de-cardado-y-diseno"},
        {"nombre": "Peinilla Dientes Anchos", "precio": 15000, "descripcion": "Perfecta para desenredar sin romper la fibra capilar. Sus dientes espaciados permiten trabajar cabellos húmedos, rizados o tratados químicamente con mayor suavidad. Ideal para aplicar tratamientos, mascarillas o definir rizos sin generar frizz. Ligera, resistente y diseñada para el uso diario en salón.", "url": "https://pieddyloperapeinados.com.co/product/peinilla-dientes-anchos"},
        {"nombre": "Peinilla Media Luna", "precio": 15000, "descripcion": "Diseñada para precisión y control total. Su forma curva permite adaptarse fácilmente al contorno de la cabeza, ideal para seccionar, alisar o peinar con técnica. El mango tipo aguja facilita divisiones limpias, y su diseño ergonómico brinda comodidad durante largas jornadas. Tu aliada perfecta para peinados pulidos y trabajos detallados.", "url": "https://pieddyloperapeinados.com.co/product/peinilla-media-luna"},
        {"nombre": "Peinilla Trincher", "precio": 30000, "descripcion": "La herramienta ideal para seccionar con rapidez y precisión. Su combinación de púas metálicas y cuerpo con peinilla permite dividir el cabello en líneas limpias sin esfuerzo. Perfecta para trabajos técnicos como coloración, alisados, trenzados o peinados detallados. Agarre antideslizante para máximo control en cada movimiento.", "url": "https://pieddyloperapeinados.com.co/product/peinilla-trincher"},
        {"nombre": "Pinza Elite Grande", "precio": 10000, "descripcion": "", "url": "https://pieddyloperapeinados.com.co/product/pinza-elite-grandes"},
        {"nombre": "Pinza Elite Pequeña", "precio": 8000, "descripcion": "", "url": "https://pieddyloperapeinados.com.co/product/pinza-elite-pequenas"},
        {"nombre": "Resortes negros pequeños de silicona", "precio": 3000, "descripcion": "", "url": "https://pieddyloperapeinados.com.co/product/resorte-negro-pequeno-de-silicona"},
        {"nombre": "Session Label The Salt 200ml", "precio": 75300, "descripcion": "The Salt es una solución salina ligera que aporta cuerpo, volumen y ese acabado mate y despeinado tipo “beach waves” sin resecar. Ideal para crear looks con textura natural y movimiento, perfecta para estilistas que buscan resultados modernos y sin esfuerzo.", "url": "https://pieddyloperapeinados.com.co/product/session-label-the-salt-200ml"},
        {"nombre": "Topsy Hair", "precio": 3000, "descripcion": "", "url": "https://pieddyloperapeinados.com.co/product/topsy-hair"},
        {"nombre": "Wella Fusion Acondicionador 200ml", "precio": 112000, "descripcion": "El acondicionador Wella Fusion repara el cabello dañado desde la fibra capilar, dejándolo más resistente, suave y manejable. Su fórmula con aminoácidos y seda lo protege contra la rotura y las agresiones diarias.", "url": "https://pieddyloperapeinados.com.co/product/vella-fusion-acondicionador-200ml"},
        {"nombre": "Wella Fusion Shampoo 250ml", "precio": 112000, "descripcion": "Limpia suavemente mientras fortalece el cabello dañado desde el interior. Deja el pelo suave, protegido y resistente a la rotura.", "url": "https://pieddyloperapeinados.com.co/product/821"}
    ])

    # ✅ Bootcamp real
    catalogo.set_bootcamp({
        "titulo": "BOOTCAMP HAIR STYLING EDITION",
        "descripcion": "Aprende técnicas de peinado desde cero o perfecciona tus habilidades.",
        "incluye": "Acceso a todas las clases, materiales de apoyo, certificado, asesoría personalizada",
        "bonos": "Clases grabadas avanzadas, descuentos en productos, sorteos exclusivos",
        "instructores": "Peledy & Charlem",
        "url": "https://pieddyloperapeinados.com.co/bootcamp"
    })

 

    # Inicializar lógica del bot y API
    bot = BotLogic(catalogo)
    #api = WhatsAppAPI()
    
    if len(sys.argv) > 1:
        entrada = sys.argv[1]
        respuesta = bot.process_message(entrada)
        print(respuesta)
        return  # salir después de responder


    print("🤖 Bot de Ventas iniciado. Escribe 'menu' para comenzar.\n")

    while True:
        try:
            user_input = input("Cliente: ")
        except (EOFError, KeyboardInterrupt):
            print("\n👋 Bot finalizado.")
            break

        if user_input.lower() in ["salir", "exit", "quit"]:
            print("👋 Bot finalizado.")
            break

        response = bot.process_message(user_input)
        print(f"[BOT] {response}")

        # 👉 Para enviar a WhatsApp real, descomenta y usa un número válido:
        #status, resp = api.send_message("573137957281", response)
       #print("API status:", status, resp)

if __name__ == "__main__":
    run_bot()