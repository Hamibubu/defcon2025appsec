CREATE DATABASE IF NOT EXISTS `defcon_store` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear usuario y otorgar permisos
CREATE USER IF NOT EXISTS 'defcon_user'@'localhost' IDENTIFIED BY 'Pa$$w0rd';
GRANT ALL PRIVILEGES ON `defcon_store`.* TO 'defcon_user'@'localhost';
FLUSH PRIVILEGES;

-- Usar la base
USE `defcon_store`;
/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.4.5-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: defcon_store
-- ------------------------------------------------------
-- Server version	11.4.5-MariaDB-1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cart_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `cart_id` (`cart_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_reviews`
--

DROP TABLE IF EXISTS `product_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `review` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `product_reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_reviews`
--

LOCK TABLES `product_reviews` WRITE;
/*!40000 ALTER TABLE `product_reviews` DISABLE KEYS */;
INSERT INTO `product_reviews` VALUES
(10,2,7,'Nice','2025-07-31 19:31:59'),
(11,2,7,'Hey','2025-07-31 19:45:06'),
(13,18,7,'What a product!','2025-08-04 00:22:16'),
(14,17,7,'I cant see nothing!!!!','2025-08-04 00:22:52'),
(15,16,7,'Cool tshirt, not too expensive','2025-08-04 00:23:13'),
(16,15,7,'The best mousepad','2025-08-04 00:23:25'),
(17,14,7,'My little toy','2025-08-04 00:23:37'),
(18,13,7,'Works as expected','2025-08-04 00:23:47'),
(19,12,7,'I want all of them','2025-08-04 00:24:11'),
(20,19,7,'My fav one','2025-08-04 00:29:11'),
(21,20,9,'I loved this','2025-08-04 00:36:18'),
(22,19,9,'Looks great in my room!','2025-08-04 00:36:31'),
(23,18,9,'Hacked my mom\'s car','2025-08-04 00:36:49'),
(24,16,9,'WOW!','2025-08-04 00:45:13'),
(25,20,10,'Great one!','2025-08-04 00:48:23'),
(26,17,10,'Bad img ','2025-08-04 00:48:49'),
(27,12,10,'Give me 1 plzzzzz!','2025-08-04 00:49:16'),
(28,11,10,'Loved it, btw nice cat pic','2025-08-04 00:49:58'),
(29,19,11,'wow','2025-08-04 00:51:55'),
(30,2,11,'Give me admin privs h4m1! plzzzz','2025-08-04 00:52:30');
/*!40000 ALTER TABLE `product_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `image_location` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`image_location`)),
  `stock` int(11) DEFAULT 0,
  `specifications` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES
(2,'DEFCON Sticker Pack',9.99,'10 assorted DEFCON stickers.','[\"\\/images\\/stickers.jpg\"]',50,'Material: Vinyl','2025-07-15 20:26:39'),
(11,'USB Rubber Ducky',48.99,'Looks like a flash drive, but injects keystrokes faster than you can say \"admin access\".','[\"\\/images\\/img_688ff8af572232.99966720.jpg\",\"\\/images\\/img_688ff996d234c9.34295979.jpg\"]',33,'Payload delivery via USB HID emulation. Fully scriptable. Compatible with DuckyScript.','2025-08-04 00:02:55'),
(12,'Flipper Zero',120.99,'Your cyber-multi-tool friend. Plays with RFID, IR, iButton, and radio like a bored spy.','[\"\\/images\\/img_688ff9f06963b2.97733886.jpg\"]',45,'Sub-GHz transceiver, NFC, RFID, infrared, GPIO pins. Open-source firmware. Hacker toy of the year.','2025-08-04 00:08:16'),
(13,'WiFi Pineapple',54.29,'Turn public Wi-Fi into your personal hunting ground. Karma never felt so good.','[\"\\/images\\/img_688ffa3db18017.87845369.jpg\"]',100,'Rogue AP creation, MITM tools, credential harvesting. Web UI. Supports modules.','2025-08-04 00:09:33'),
(14,'Tux the Linux Penguin Plush',20.99,'A cuddly version of the most legendary open-source mascot. Huggable, hackable, and 100% kernel-approved.','[\"\\/images\\/img_688ffa7e32b6a8.80796687.jpeg\"]',499,'Height: 25cm. Material: Soft plush fabric. Surface washable. No proprietary blobs included.','2025-08-04 00:10:38'),
(15,'Mousepad \"rm -rf /\" - The Ultimate Power Move',12.29,'A mousepad for those who know true power lies in the terminal. Minimalist design featuring the most feared command: rm -rf /. Dare to bring it to your desk?','[\"\\/images\\/img_688ffaf69a8720.88301021.jpg\"]',33,'Dimensions: 30x25 cm. Material: Non-slip surface, black rubber base, splash-resistant. Compatible with all types of mice, optical and laser.','2025-08-04 00:12:38'),
(16,'Ransomware T-Shirt - \"Pay Up or Else!',19.99,'Show off your dark side with this edgy ransomware-inspired tee. Perfect for hackers, cybersecurity pros, or anyone with a wicked sense of humor.','[\"\\/images\\/img_688ffb75cbadc9.28782026.jpg\"]',100,'Material: 100% cotton. Available in sizes S to XXL. Color: Black with neon green print. Machine washable.','2025-08-04 00:14:45'),
(17,'Desk Mat “Kernel Panic”',12.99,'Large mouse pad/desk mat featuring a glitch art-inspired “Kernel Panic” screen design. Perfect for gamers and sysadmins.','[\"\\/images\\/img_688ffc432c93c1.65336550.jpeg\"]',44,'Size: 80x30 cm. Anti-slip rubber base.','2025-08-04 00:18:11'),
(18,'HackRF One',289.99,'The HackRF One is a versatile, open-source software-defined radio designed for RF enthusiasts, hackers, and researchers. It enables transmission and reception of signals from 1 MHz to 6 GHz, covering a broad range of wireless protocols. ','[\"\\/images\\/img_688ffd20a91fb1.09627502.jpeg\"]',250,'This half-duplex transceiver supports up to 20 MHz bandwidth and connects via USB 2.0 High Speed, drawing power directly from the USB port without the need for external power sources. Compact and portable, measuring approximately 11 by 7 by 1.5 centimeters, the HackRF One is fully open source, compatible with popular SDR software such as GNU Radio, SDR#, and GQRX, and works seamlessly on Windows, Linux, and macOS. Ideal for wireless protocol research, signal analysis, security testing, and RF development, it’s the perfect tool for exploring the radio spectrum.','2025-08-04 00:21:52'),
(19,'Tux Poster',9.99,'Meet Tux, the fearless penguin who stands for freedom in the digital world. This poster captures the rebellious spirit of open source, reminding you that true power lies in sharing, hacking, and breaking free from the norms.','[\"\\/images\\/img_688ffec3e73973.77291392.jpg\"]',120,'Printed with vibrant, eye-catching colors that pop on any wall, this poster comes in sizes that fit perfectly whether you’re decking out your hacker den or just want a cool piece to inspire your daily grind.','2025-08-04 00:28:51'),
(20,'I use arch btw',12.99,'Wear your Linux cred loud and proud with this “I use Arch btw” tee — the ultimate flex for those who live on the edge of customization and control. Perfect for showing off your mastery of the Arch way, it’s a nod to the true tinkerers who like their systems lightweight, bleeding-edge, and 100% theirs.','[\"\\/images\\/img_688fff79b0c4d0.97522522.jpg\"]',45,'Made from soft, breathable cotton that’s built to keep up with your all-night coding marathons and coffee-fueled hacking sessions. The print is sharp and durable, so the message stays clear no matter how many times you debug or recompile your kernel.','2025-08-04 00:31:53');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cart_id` int(11) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `cart_id` (`cart_id`),
  CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `role` varchar(50) DEFAULT 'user',
  `bio` text DEFAULT NULL,
  `verified` tinyint(1) DEFAULT 0,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(7,'h4m1','$2y$12$iWziuahk9tIWqIjKfKjROutos1/QvwMn0p/sV8mFDLDVWjZz7aXSa','2025-07-30 19:42:30','administrator','Hey there im the admin, dont try to hack the webapp or u will be in problems!',1,'101 Hacker Ln, Cybercityya','555-202-3030','h4m1@example.com'),
(9,'nullPointer','$2y$12$nRcatt112HWC1XJLZZAyouqZsuj8jyaGTbmMsOpL8hHeq7A2JNrgK','2025-08-04 00:35:54','user','Pointing to nothing, crashing your code and your dreams.',0,'Null street','0','null@undefined.com'),
(10,'PwnedPenguin','$2y$12$nkWmj0Fn3V4lcY8pO1AEW.zthsBcz6sGQUxazco0/dqxjoj/sIJT6','2025-08-04 00:47:43','user','Cold-blooded hacker, warm-blooded meme lover.',0,'Stallman St #23','5632356789','free@software.com'),
(11,'BotnetBuster','$2y$12$2/iMVhvld9/QTe3HB40jLujxYfBD5UOSuuePm/q1WKeaniRlh.CF2','2025-08-04 00:51:21','user','Killing botnets before breakfast.',0,'Mirai St #23','4535634890','bot@net.com');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-08-03 17:53:59
