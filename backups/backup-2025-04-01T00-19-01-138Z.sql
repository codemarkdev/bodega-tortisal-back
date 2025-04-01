-- MySQL dump 10.13  Distrib 8.0.41, for Linux (x86_64)
--
-- Host: 172.24.64.1    Database: bodega_tortisal
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `firstname` varchar(256) NOT NULL,
  `lastname` varchar(256) NOT NULL,
  `dui` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (2,'Juan Antonio','Baiza Hernandez','00000000-0'),(3,'Franklin Esau','Polio Velasquez','00000000-0');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `missing_products`
--

DROP TABLE IF EXISTS `missing_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `missing_products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `missing_quantity` int NOT NULL,
  `id_shift` int unsigned DEFAULT NULL,
  `id_product` int unsigned DEFAULT NULL,
  `id_tools_issued` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_e66ba333b77a0fd1a2f44a2af63` (`id_product`),
  KEY `FK_ef71f9e216aff0ad30a87b0e40c` (`id_tools_issued`),
  KEY `FK_38dd32fb183818a6b0d6bdb0e4e` (`id_shift`),
  CONSTRAINT `FK_38dd32fb183818a6b0d6bdb0e4e` FOREIGN KEY (`id_shift`) REFERENCES `shifts` (`id`),
  CONSTRAINT `FK_e66ba333b77a0fd1a2f44a2af63` FOREIGN KEY (`id_product`) REFERENCES `products` (`id`),
  CONSTRAINT `FK_ef71f9e216aff0ad30a87b0e40c` FOREIGN KEY (`id_tools_issued`) REFERENCES `tools_issued` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `missing_products`
--

LOCK TABLES `missing_products` WRITE;
/*!40000 ALTER TABLE `missing_products` DISABLE KEYS */;
INSERT INTO `missing_products` VALUES (1,1,7,2,2),(2,1,7,2,2),(3,2,8,4,7),(4,1,12,3,9),(5,2,12,3,9),(7,2,12,3,9);
/*!40000 ALTER TABLE `missing_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(220) NOT NULL,
  `purchase_price` decimal(10,2) NOT NULL,
  `quantity` int NOT NULL,
  `is_consumable` tinyint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (2,'Bolsa de Cemento 42.5 Kg','Bolsa de cemento 42.5 Kg blanca',29.50,20,0),(3,'Pulidora','Pulidora',2.00,44,1),(4,'Destornillador Philips','Destornillador',3.00,38,0);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shifts`
--

DROP TABLE IF EXISTS `shifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shifts` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `id_employee` int unsigned DEFAULT NULL,
  `check_in_time` varchar(255) NOT NULL,
  `check_out_time` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_290d1f9a4d6140d8b6abc9d1616` (`id_employee`),
  CONSTRAINT `FK_290d1f9a4d6140d8b6abc9d1616` FOREIGN KEY (`id_employee`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shifts`
--

LOCK TABLES `shifts` WRITE;
/*!40000 ALTER TABLE `shifts` DISABLE KEYS */;
INSERT INTO `shifts` VALUES (7,2,'30-03-2025 23:04:36','30-03-2025 23:09:13'),(8,2,'30-03-2025 23:20:36','30-03-2025 23:57:23'),(12,3,'31-03-2025 11:10:02','31-03-2025 12:16:08');
/*!40000 ALTER TABLE `shifts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tools_issued`
--

DROP TABLE IF EXISTS `tools_issued`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tools_issued` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quantity_issued` int NOT NULL,
  `quantity_returned` int DEFAULT NULL,
  `id_shift` int unsigned DEFAULT NULL,
  `id_product` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_bb215dbbabdb0a17b3f1530a6bb` (`id_shift`),
  KEY `FK_66368b61eb97cea7204e5ae593f` (`id_product`),
  CONSTRAINT `FK_66368b61eb97cea7204e5ae593f` FOREIGN KEY (`id_product`) REFERENCES `products` (`id`),
  CONSTRAINT `FK_bb215dbbabdb0a17b3f1530a6bb` FOREIGN KEY (`id_shift`) REFERENCES `shifts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tools_issued`
--

LOCK TABLES `tools_issued` WRITE;
/*!40000 ALTER TABLE `tools_issued` DISABLE KEYS */;
INSERT INTO `tools_issued` VALUES (1,2,NULL,NULL,NULL),(2,2,1,7,2),(3,2,NULL,7,3),(4,10,NULL,7,4),(5,2,2,8,2),(6,2,1,8,3),(7,2,0,8,4),(8,2,2,12,2),(9,2,0,12,3);
/*!40000 ALTER TABLE `tools_issued` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'admin',
  `password` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_fe0bb3f6520ee0469504521e71` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'john_doe','admin','$2b$10$lmIv9y07CSQpGLE/LcAGou2snZJ0pDPjzGkvzezktquND4vFDqS4G');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-31 18:19:01
