
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAllSituations } from '@/lib/situationService';
import { auth } from '@/lib/firebase';

export interface Situation {
  id: string;
  title: string;
  description: string;
  image: string;
  examples: string[];
}

export const situationsData: Situation[] = [
  {
    title: "Restaurante",
    description: "Aprenda a fazer pedidos, entender o cardápio e interagir com garçons.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Je voudrais réserver une table pour deux personnes.",
      "Qu'est-ce que vous recommandez ?",
      "L'addition, s'il vous plaît."
    ]
  },
  {
    title: "Hotel",
    description: "Vocabulário essencial para check-in, serviços e comunicação com staff.",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "J'ai une réservation au nom de...",
      "À quelle heure est le petit-déjeuner ?",
      "Pouvez-vous appeler un taxi ?"
    ]
  },
  {
    title: "Transporte",
    description: "Como se locomover usando metrô, ônibus e táxi na França.",
    image: "https://images.unsplash.com/photo-1515165562839-978bbcf18277?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Je voudrais acheter un ticket de métro.",
      "Comment aller à... ?",
      "Où est l'arrêt de bus ?"
    ]
  },
  {
    title: "Animais",
    description: "Vocabulário relacionado a animais de estimação e veterinários.",
    image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Mon chien/chat est malade.",
      "Où puis-je promener mon chien?",
      "Avez-vous de la nourriture pour..."
    ]
  },
  {
    title: "Supermercado",
    description: "Aprenda a fazer compras, pedir produtos e interagir com funcionários.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Où puis-je trouver les légumes ?",
      "Je cherche du fromage français.",
      "Avez-vous des sacs plastiques ?"
    ]
  },
  {
    title: "Farmácia",
    description: "Vocabulário para comprar medicamentos e explicar sintomas.",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "J'ai besoin d'un médicament pour le mal de tête.",
      "Avez-vous quelque chose pour la toux ?",
      "Je suis allergique à..."
    ]
  },
  {
    title: "Médico",
    description: "Frases úteis para consultas médicas e emergências de saúde.",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "J'ai mal à la tête/gorge/ventre.",
      "Depuis quand avez-vous ces symptômes ?",
      "Je dois prendre rendez-vous avec un médecin."
    ]
  },
  {
    title: "Banco",
    description: "Como realizar operações bancárias e falar sobre dinheiro em francês.",
    image: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Je voudrais retirer de l'argent.",
      "Quel est le taux de change ?",
      "Comment ouvrir un compte bancaire ?"
    ]
  },
  {
    title: "Turismo",
    description: "Vocabulário para visitar pontos turísticos e pedir informações.",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Quels sont les horaires d'ouverture ?",
      "Combien coûte l'entrée ?",
      "Y a-t-il une visite guidée en anglais ?"
    ]
  },
  {
    title: "Compras",
    description: "Frases úteis para comprar roupas, souvenirs e negociar preços.",
    image: "https://images.unsplash.com/photo-1482555670981-4de159d487e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Je cherche un cadeau souvenir.",
      "Avez-vous cette robe en taille 40 ?",
      "C'est trop cher, pouvez-vous faire un prix ?"
    ]
  },
  {
    title: "Emergências",
    description: "Frases essenciais para situações de emergência e pedidos de ajuda.",
    image: "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Au secours ! J'ai besoin d'aide !",
      "Appelez une ambulance, s'il vous plaît !",
      "Il y a eu un accident."
    ]
  },
  {
    title: "Escritório",
    description: "Vocabulário para ambiente de trabalho e reuniões profissionais.",
    image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Je voudrais fixer un rendez-vous.",
      "Pouvons-nous reporter la réunion ?",
      "Voici ma carte de visite."
    ]
  },
  {
    title: "Escola",
    description: "Frases para ambiente escolar, aulas e interação com professores.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Je n'ai pas compris, pouvez-vous répéter ?",
      "À quelle heure commence le cours ?",
      "Puis-je emprunter votre stylo ?"
    ]
  },
  {
    title: "Festas",
    description: "Como socializar, fazer amizades e participar de eventos sociais.",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Enchanté(e) de faire votre connaissance.",
      "Qu'est-ce que vous faites dans la vie ?",
      "On peut se tutoyer ?"
    ]
  },
  {
    title: "Clima",
    description: "Vocabulário para falar sobre o tempo e condições climáticas.",
    image: "https://images.unsplash.com/photo-1514632595-4944383f2737?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Quel temps fait-il aujourd'hui ?",
      "Il va pleuvoir demain ?",
      "Il fait trop chaud/froid."
    ]
  },
  {
    title: "Telefone",
    description: "Como fazer ligações, deixar recados e resolver problemas por telefone.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Allô, qui est à l'appareil ?",
      "Je voudrais parler à Monsieur/Madame...",
      "Pouvez-vous prendre un message ?"
    ]
  },
  {
    title: "Direções",
    description: "Como pedir e dar informações sobre localizações e direções.",
    image: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Excusez-moi, où se trouve... ?",
      "Je suis perdu(e), pouvez-vous m'aider ?",
      "Tournez à droite/gauche au prochain carrefour."
    ]
  },
  {
    title: "Culinária",
    description: "Vocabulário sobre comida, receitas e tradições gastronômicas francesas.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Quels sont les ingrédients de ce plat ?",
      "Comment prépare-t-on une bonne ratatouille ?",
      "C'est un plat typique de quelle région ?"
    ]
  },
  {
    title: "Esportes",
    description: "Frases para praticar esportes e falar sobre atividades físicas.",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Où peut-on jouer au football/tennis ?",
      "Je voudrais m'inscrire à un cours de natation.",
      "Quels sont les horaires de la salle de sport ?"
    ]
  },
  {
    title: "Cultura",
    description: "Vocabulário para falar sobre arte, literatura e cultura francesa.",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Quel est votre écrivain français préféré ?",
      "Pouvez-vous me recommander un bon film français ?",
      "J'aimerais visiter des galeries d'art."
    ]
  },
  {
    title: "Café",
    description: "Aprenda a pedir café, bebidas e lanches em cafeterias francesas.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Je voudrais un café crème, s'il vous plaît.",
      "Avez-vous des croissants frais ?",
      "L'addition, s'il vous plaît."
    ]
  },
  {
    title: "Biblioteca",
    description: "Vocabulário para usar bibliotecas e centros culturais.",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Je cherche un livre sur l'histoire de France.",
      "Puis-je emprunter ce livre ?",
      "Où sont les ordinateurs ?"
    ]
  },
  {
    title: "Cinema",
    description: "Como comprar ingressos e aproveitar sessões de cinema.",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Je voudrais deux places pour...",
      "C'est un film en version originale ?",
      "Où sont nos sièges ?"
    ]
  },
  {
    title: "Correios",
    description: "Vocabulário para enviar cartas e encomendas.",
    image: "https://images.unsplash.com/photo-1512075135822-67cdd9dd7314?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Je voudrais envoyer cette lettre en France.",
      "Combien coûte un timbre pour l'étranger ?",
      "Je voudrais suivre mon colis."
    ]
  },
  {
    title: "Universidade",
    description: "Frases úteis para estudantes universitários e ambiente acadêmico.",
    image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Je suis étudiant en échange.",
      "Où se trouve la bibliothèque universitaire ?",
      "Quand commence le semestre ?"
    ]
  },
  {
    title: "Entrevista de Emprego",
    description: "Vocabulário para entrevistas de trabalho e processos seletivos.",
    image: "https://images.unsplash.com/photo-1560264280-88b68371db39?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "J'ai de l'expérience dans ce domaine.",
      "Quelles sont les responsabilités de ce poste ?",
      "Je suis disponible à partir de..."
    ]
  },
  {
    title: "Tecnologia",
    description: "Vocabulário relacionado a computadores, internet e dispositivos eletrônicos.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Mon ordinateur ne fonctionne pas.",
      "Comment se connecter au Wi-Fi ?",
      "J'ai besoin d'un chargeur pour mon téléphone."
    ]
  },
  {
    title: "Família",
    description: "Vocabulário para falar sobre relações familiares e eventos.",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Je vous présente ma famille.",
      "Nous fêtons l'anniversaire de ma grand-mère.",
      "Combien de frères et sœurs avez-vous ?"
    ]
  },
  {
    title: "Música",
    description: "Frases para falar sobre gostos musicais e eventos.",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Quel genre de musique aimez-vous ?",
      "Je voudrais des billets pour ce concert.",
      "Qui est votre artiste français préféré ?"
    ]
  },
  {
    title: "Moda",
    description: "Vocabulário para falar sobre roupas, estilos e compras de moda.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Cette couleur vous va très bien.",
      "Je cherche une tenue pour une occasion spéciale.",
      "Quelle est la tendance cette saison ?"
    ]
  },
  {
    title: "Jardinagem",
    description: "Vocabulário para falar sobre plantas, jardins e atividades ao ar livre.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "J'adore jardiner le weekend.",
      "Quelles plantes sont faciles à cultiver ?",
      "Avez-vous des outils de jardinage ?"
    ]
  },
  {
    title: "Vinhos",
    description: "Aprenda a falar sobre vinhos, degustações e regiões vinícolas francesas.",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Je préfère le vin rouge/blanc/rosé.",
      "De quelle région vient ce vin ?",
      "Pouvez-vous me recommander un bon vin ?"
    ]
  },
  {
    title: "Praia",
    description: "Vocabulário para atividades na praia e férias à beira-mar.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Où est la plage la plus proche ?",
      "Je voudrais louer un parasol et des chaises.",
      "L'eau est-elle bonne pour nager ?"
    ]
  },
  {
    title: "Fotografia",
    description: "Frases úteis para fotógrafos e entusiastas de fotografia.",
    image: "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Puis-je prendre une photo ici ?",
      "Pouvez-vous nous prendre en photo ?",
      "Quel appareil photo utilisez-vous ?"
    ]
  },
  {
    title: "Casamento",
    description: "Vocabulário para cerimônias de casamento e celebrações.",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Félicitations pour votre mariage !",
      "Où aura lieu la réception ?",
      "Je vous souhaite beaucoup de bonheur."
    ]
  },
  {
    title: "Camping",
    description: "Frases para acampamentos e atividades ao ar livre.",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Où peut-on installer notre tente ?",
      "Avez-vous un sac de couchage ?",
      "Y a-t-il des douches dans le camping ?"
    ]
  },
  {
    title: "Cozinhando",
    description: "Vocabulário para preparar refeições e seguir receitas.",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Comment prépare-t-on cette recette ?",
      "Quels ingrédients me faut-il ?",
      "À quelle température et pendant combien de temps ?"
    ]
  },
  {
    title: "Museus",
    description: "Frases úteis para visitar museus e exposições de arte.",
    image: "https://images.unsplash.com/photo-1565060169194-19fabf63eba8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "À quelle heure ouvre le musée ?",
      "Y a-t-il une exposition temporaire ?",
      "Est-ce qu'on peut prendre des photos ?"
    ]
  },
  {
    title: "Mercado de Rua",
    description: "Vocabulário para compras em feiras e mercados locais.",
    image: "https://images.unsplash.com/photo-1513125370-3460ebe3401b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "C'est combien le kilo ?",
      "Ces fruits sont-ils de saison ?",
      "Pouvez-vous me faire goûter ?"
    ]
  },
  {
    title: "Salão de Beleza",
    description: "Frases para cabeleireiros, manicures e tratamentos estéticos.",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Je voudrais couper mes cheveux.",
      "Pouvez-vous me montrer des modèles ?",
      "Je voudrais une manucure, s'il vous plaît."
    ]
  },
  {
    title: "Aniversário",
    description: "Vocabulário para celebrações de aniversário e presentes.",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Joyeux anniversaire !",
      "Quel âge as-tu aujourd'hui ?",
      "Voici un petit cadeau pour toi."
    ]
  },
  {
    title: "Concertos",
    description: "Frases úteis para eventos musicais e shows.",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "À quelle heure commence le concert ?",
      "Où se trouve notre place ?",
      "Qui est l'artiste principal ?"
    ]
  },
  {
    title: "Bicicleta",
    description: "Vocabulário para ciclismo e aluguel de bicicletas.",
    image: "https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Où peut-on louer des vélos ?",
      "Y a-t-il des pistes cyclables ?",
      "Ma chaîne est cassée, pouvez-vous m'aider ?"
    ]
  },
  {
    title: "Dentista",
    description: "Frases para consultas odontológicas e problemas dentários.",
    image: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "J'ai mal à une dent.",
      "Je dois prendre rendez-vous avec un dentiste.",
      "Est-ce que c'est une urgence ?"
    ]
  },
  {
    title: "Padaria",
    description: "Vocabulário para comprar pães, bolos e doces franceses.",
    image: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Je voudrais une baguette, s'il vous plaît.",
      "Ces croissants sont-ils frais ?",
      "Avez-vous des pâtisseries françaises ?"
    ]
  },
  {
    title: "Lavanderia",
    description: "Frases úteis para lavar roupas e serviços de lavanderia.",
    image: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Où puis-je laver mes vêtements ?",
      "Quand seront-ils prêts ?",
      "Combien coûte le service de pressing ?"
    ]
  },
  {
    title: "Parque",
    description: "Vocabulário para atividades em parques e áreas verdes.",
    image: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Où est le parc le plus proche ?",
      "À quelle heure ferme le parc ?",
      "Peut-on faire un pique-nique ici ?"
    ]
  },
  {
    title: "Estação de Trem",
    description: "Frases para viagens de trem e compra de bilhetes.",
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "À quelle heure part le train pour Paris ?",
      "Je voudrais un billet aller-retour.",
      "Sur quel quai arrive le train ?"
    ]
  },
  {
    title: "Aeroporto",
    description: "Vocabulário essencial para viagens aéreas e procedimentos de embarque.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Où est le comptoir d'enregistrement ?",
      "À quelle heure est l'embarquement ?",
      "Mon vol est retardé/annulé."
    ]
  },
  {
    title: "Aluguel de Carro",
    description: "Frases úteis para alugar e devolver veículos.",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Je voudrais louer une voiture pour trois jours.",
      "Quel type d'assurance est inclus ?",
      "Où dois-je rendre la voiture ?"
    ]
  },
  {
    title: "Piquenique",
    description: "Vocabulário para organizar e desfrutar de piqueniques ao ar livre.",
    image: "https://images.unsplash.com/photo-1526999847416-7f31e5f53838?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "C'est un bon endroit pour un pique-nique.",
      "Avez-vous apporté une nappe ?",
      "J'ai préparé des sandwichs et des salades."
    ]
  },
  {
    title: "Teatro",
    description: "Frases para assistir peças teatrais e espetáculos.",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Je voudrais réserver des places pour ce soir.",
      "À quelle heure commence la représentation ?",
      "Y a-t-il un entracte ?"
    ]
  },
  {
    title: "Aulas de Francês",
    description: "Vocabulário para estudantes de língua francesa.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Comment dit-on... en français ?",
      "Pouvez-vous répéter plus lentement ?",
      "Je ne comprends pas cette règle de grammaire."
    ]
  },
  {
    title: "Joalheria",
    description: "Frases para comprar joias e acessórios.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Je cherche une bague en or.",
      "Pouvez-vous ajuster ce bracelet ?",
      "C'est pour offrir en cadeau."
    ]
  },
  {
    title: "Livraria",
    description: "Vocabulário para comprar livros e material de leitura.",
    image: "https://images.unsplash.com/photo-1526243741027-444d633d7365?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Avez-vous ce livre en français ?",
      "Je cherche la section des romans.",
      "Pouvez-vous me recommander un auteur français ?"
    ]
  },
  {
    title: "Castelos",
    description: "Frases para visitar castelos e monumentos históricos.",
    image: "https://images.unsplash.com/photo-1591793559994-e2406e1a1dc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Quand a été construit ce château ?",
      "Y a-t-il une visite guidée en portugais ?",
      "Peut-on visiter toutes les pièces ?"
    ]
  },
  {
    title: "Vinícolas",
    description: "Vocabulário para degustação de vinhos e visitas a vinícolas.",
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Peut-on faire une dégustation ?",
      "Comment est produit ce vin ?",
      "Quels cépages utilisez-vous ?"
    ]
  },
  {
    title: "Cruzeiros",
    description: "Frases úteis para viagens de cruzeiro e passeios de barco.",
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "À quelle heure est le départ ?",
      "Où se trouve ma cabine ?",
      "Y a-t-il des gilets de sauvetage ?"
    ]
  },
  {
    title: "Spa",
    description: "Vocabulário para tratamentos de bem-estar e relaxamento.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    examples: [
      "Je voudrais réserver un massage.",
      "Quels types de soins proposez-vous ?",
      "Est-ce que je dois apporter un maillot de bain ?"
    ]
  }
];

const SituationsPage = () => {
  const [situations, setSituations] = useState<Situation[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadSituations = async () => {
      try {
        const data = await getAllSituations();
        setSituations(data);
      } catch (error) {
        console.error('Error loading situations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSituations();
  }, []);

  // Limit situations to 3 for non-logged in users
  const displayedSituations = user ? situations : situations.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-french-lightGray py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-french-dark mb-4">Situações do Dia a Dia</h1>
            <p className="text-french-gray mb-8">
              Aprenda francês contextualizado para situações reais que você encontrará em sua viagem.
              Explore as categorias abaixo e prepare-se para se comunicar com confiança.
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p>Carregando situações...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedSituations.map((situation) => (
                  <div 
                    key={situation.id}
                    className="glass-card hover-card-effect rounded-xl overflow-hidden"
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={situation.image} 
                        alt={situation.title}
                        className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-french-dark mb-2">{situation.title}</h3>
                      <p className="text-french-gray mb-4">{situation.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-french-dark mb-2">Exemplos:</h4>
                        <ul className="text-sm text-french-gray space-y-1">
                          {situation.examples.map((example, i) => (
                            <li key={i} className="italic">{example}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <Link 
                        to={`/situacoes/${situation.id}`}
                        className="text-french-blue font-medium hover:underline"
                      >
                        Aprender mais →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
              {!user && situations.length > 3 && (
                <div className="mt-12 text-center">
                  <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-2xl font-bold text-french-dark mb-3">Quer acessar todas as {situations.length} situações?</h3>
                    <p className="text-french-gray mb-6">Cadastre-se gratuitamente para desbloquear todas as situações e recursos de aprendizado.</p>
                    <Link 
                      to="/cadastro" 
                      className="bg-french-blue hover:bg-french-lightBlue text-white font-medium py-3 px-6 rounded-md transition-all duration-300 ease-in-out inline-block"
                    >
                      Cadastre-se agora
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SituationsPage;
