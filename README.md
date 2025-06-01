# 🛡️ EnsajSurveillance - Application Web de Gestion de la Surveillance des Examens

Bienvenue sur le dépôt officiel de **EnsajSurveillance**, une application développée dans le cadre du Projet de Fin d’Année à l’ENSA El Jadida. Elle a pour but de moderniser la gestion de la surveillance des examens en automatisant la planification, tout en prenant en compte les préférences et les contraintes des enseignants.

🔗 **Lien du dépôt GitHub** : [github.com/walid-mataich/EnsajSeurveillance](https://github.com/walid-mataich/EnsajSeurveillance)

---

## 🧭 Sommaire

- 🎯 Objectif du projet
- 🚀 Fonctionnalités
- 📁 Architecure du projet
- 🛠️ Technologies utilisées
- 🧪 Installation & Exécution

---

## 🎯 Objectif du projet

✅ Optimiser l’attribution des surveillants selon :
- Leurs disponibilités
- Leurs préférences
- Les contraintes organisationnelles

✅ Faciliter le travail des administrateurs en automatisant la planification

✅ Offrir une interface ergonomique, intuitive et responsive

---

## 🚀 Fonctionnalités

### 👨‍💼 Administrateurs
- Gestion des comptes surveillants
- Création des examens, créneaux, matières, salles
- Génération automatique des plannings
- Visualisation/export en PDF
- Réception de messages et réclamations
- Accès au chatbot intelligent

### 👨‍🏫 Surveillants
- Saisie des préférences de disponibilité
- Consultation du planning personnel
- Connexion sécurisée
- Messagerie avec l’administration
- Assistance via chatbot

---


---

## 🛠️ Technologies utilisées

| Élément        | Technologie         |
| -------------- | ------------------- |
| Backend        | Spring Boot (Java)  |
| Frontend       | React.js, TailwindCSS |
| Base de données| MySQL               |
| Authentification | Spring Security    |
| API            | REST (Axios)        |
| Tests          | Postman, Google Lighthouse |
| Méthodologie   | Scrum (6 sprints)   |
| Collaboration  | Git, GitHub, Jira   |

---

## 🧪 Installation & Exécution

### 📦 Prérequis
- Node.js ≥ 14.x
- Maven ≥ 3.x
- Java ≥ 17
- MySQL ≥ 8.x

### ▶️ Étapes

#### 1. Cloner le dépôt

```bash
git clone https://github.com/walid-mataich/EnsajSeurveillance.git
cd EnsajSeurveillance
```
#### 2. Lancer le backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

#### 3. Lancer le frontend (React)

```bash
cd ../frontend
npm install
npm run dev
```



