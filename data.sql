-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: mat_nice_ecommerce
-- ------------------------------------------------------
-- Server version	8.0.43-0ubuntu0.24.04.1

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
-- Table structure for table `brand`
--

DROP TABLE IF EXISTS `brand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brand` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brand`
--

LOCK TABLES `brand` WRITE;
/*!40000 ALTER TABLE `brand` DISABLE KEYS */;
INSERT INTO `brand` VALUES (1,'Ray-Ban','Are you looking for THE brand for glasses and sunglasses? Then you are certainly in the right place. Ray-Ban remains popular beyond any other eyewear label and continues to dominate the world\'s best-seller lists. The most famous model probably belongs to the Aviator and was originally designed for the pilots of the U.S. Air Force. The Wayfarer and Clubmaster have also been cult figures for a considerable time and it is impossible to imagine the world without them. The prescription and sunglasses models of the cult label continue setting new trends, and it never gets boring: year after year, the range is expanded with new forms and colour variations. The mix of design, functionality and quality form the recipe for success of the label, no wonder so many of its followers are famous individuals. Test it out and reveal the star potential in you!','2025-08-11 01:58:23',1,NULL,NULL,NULL,NULL),(2,'Gucci','High quality, tradition and sustainability - that\'s what the luxury label Gucci represents for more than 80 years. It is the choice for fashion lovers with the most exclusive taste and the highest standards. The label embodies the Italian flair and craftsmanship and is the epitome of luxury and elegance. The collections include large and eye-catching frames, as well as delicate and refined models. The designer focuses mainly on angular shapes with and without rims and offers a wide range of colours while always maintaining the classic sophistication. With the purchase of a product, you can contribute to something meaningful, because social engagement is of utmost importance to the brand. More than $12 million of proceeds have already been donated to UNICEF.','2025-08-11 01:59:20',1,NULL,NULL,NULL,NULL),(3,'Prada','Prada! This is the answer if you are looking for the oldest and most prominent luxury label in the world. The prestigious label from Milan is celebrating its 100th birthday this year. Now, they are applying their signature extravagant flair to their eyewear collections as well. Miuccia Prada is committed to preserving traditional craftsmanship and the use of local materials and techniques. She thus manages to create models that are both contemporary and out of the ordinary. Whether you are looking for striking or flamboyant models, with the unusual selection of colours and styles, you too will find the perfect addition to your favourite outfit.','2025-08-11 01:59:58',1,NULL,NULL,NULL,NULL),(4,'adidas Originals','The origin of adidas Originals success story has its roots in founder Adi Dassler\'s profound connection to sports. As a devoted athlete, Dassler knew the importance of the perfect equipment for an athlete\'s success. Nowadays, the renowned adidas Originals brand is synonymous with innovative, functional and trend-conscious streetwear, which is also reflected in its eyewear collection. Adorned with the iconic Trefoil logo, adidas eyewear is timelessly and authentically styled, with vibrant colours and a vintage touch that is true to the motto \"Original is never finished\".','2025-08-11 02:08:01',1,NULL,NULL,NULL,NULL),(5,'Balenciaga','Founded in Paris in 1917, the fashion label Balenciaga, founded by a Spanish couturier, is one of the most iconic fashion houses today. The brand\'s concept is simple but extremely successful: master craftsmanship and innovative materials are transformed into extraordinary designs, thus creating exclusive collections that transcend conventions. The premium eyewear sets new standards in terms of quality and style, also embodies this commitment to excellence. Whether in expressive colours or simply \"black and bold\" - the frames add an incomparable Balenciaga touch to every outfit.','2025-08-11 02:08:39',1,NULL,NULL,NULL,NULL),(6,'BOSS','BOSS embodies authentic and refined luxury.\n\nThe men\'s collection offers modern, refined business and evening wear as well as sophisticated casual looks and premium sportswear for leisure. The unique cut, high quality materials and exquisite styles are designed to accentuate the man\'s personality and provide him with the confidence for every occasion.\n\nThe women\'s collection from Boss offers feminine designs with a focus on excellent craftsmanship, fine fabrics and details. The wide range of modern business attire, exclusive casual looks and glamorous evening dresses combine contemporary silhouettes with excellent design and timeless elegance.\n\nMatching shoes and accessories such as watches, eyewear and perfumes complement the looks perfectly.','2025-08-11 02:09:04',1,NULL,NULL,NULL,NULL),(7,'Burberry','Chequered? Certainly not! The luxury brand Burberry is much more than its famous chequered pattern. Today, the traditional label is synonymous with classic British fashion at its best. Hardly any other brand knows how to so stylishly combine tradition and modernity while at the same time constantly reinventing itself. The innovative designs of the frames revive fashion classics and possess a unique charm. Soft lines and subtle colours are cleverly combined to create elegance and grace. The frames embody sophisticated tradition that place high demands on quality and design. Discover the British classic!','2025-08-11 02:09:47',1,NULL,NULL,NULL,NULL),(8,'Calvin Klein','The American lifestyle brand Calvin Klein has been synonymous with authenticity, individuality and progressiveness since its foundation in 1968. It embodies the appeal of a minimalist and progressive aesthetic like no other fashion brands and has thus firmly secured a position among the most successful apparel companies worldwide. Expressive frames, carefully selected materials and sophisticated design inspirations ensure that Calvin Klein remains the leading label when it comes to stylish eyewear accessories.','2025-08-11 02:11:13',1,NULL,NULL,NULL,NULL),(9,'Chloé','Elegance, romance and femininity at its finest - if there is one label that has all the qualities a woman desires, it is probably the haute couture brand Chloé. Founded in 1952, the company collaborates with numerous leading designers. The timeless yet eye-catching design of the frames flows like a thread through all the collections and always in harmony with the delicate contours. The opulent design element of the models leaves something to be desired and is inspired by the feminine butterfly shape. Round, bold angular models captivate with their modern vintage design. In addition, carefully incorporated details are complemented by romantic colour palette with noble gold, rich brown and modern black. The design always focuses on a trendy mix of synthetic materials and metal as well as the integration of floral and iconic basic elements. Who can resist that?','2025-08-11 02:11:53',1,NULL,NULL,NULL,NULL),(10,'Converse','Founded in 1908 Converse is one of the few brands that has managed to inspire people for many decades. Created by basketball legend Chuck Taylor, the Converse Chuck Taylor All Star sneaker became a hit and is worn and loved by artists and icons to this day. As a symbol of individuality, it enjoys absolute cult status, and the sunglasses collection of the label are just as iconic. Be it Wayfarer, rectangular or Aviator - with its classic, timeless designs and superb colour combinations, each model exudes plenty of retro charm. Experience summer with an icon that completes every style!','2025-08-11 02:12:34',1,NULL,NULL,NULL,NULL),(11,'David Beckham','Newly launched on the market, the premium brand David Beckham is already making its mark. The successful footballer and world-famous fashion icon always dress modern and tasteful without pursuing the latest trends. The style of his eyewear is also a skilful fusion of design and craftsmanship. Drawing on the expertise of the traditional Italian company Safilo, he creates luxurious sunglasses and prescription eyewear with a striking and stylish design that offers the best workmanship and quality.','2025-08-11 02:13:06',1,NULL,NULL,NULL,NULL),(12,'Dior','When Christian Dior opened his first haute couture atelier in Paris in 1946, his vision was to design feminine and elegant women\'s fashion beyond conventional boundaries. Today, the Dior brand symbolises luxurious, extravagant and sensual creations that are always ahead of the times. The eyewear collections feature clear lines, contemporary to futuristic designs and unique details. Dior brilliantly demonstrates its talent for highlighting the wearer\'s personality, which makes it one of the most successful fashion empires in the world, and rightly so.','2025-08-11 02:13:46',1,NULL,NULL,NULL,NULL),(13,'Dolce&Gabbana','Domenico Dolce was born with an exceptional talent for fashion. He designed his first jacket as a seven-year-old bambino, and before long, the catwalk became his second home. The fashion label Dolce & Gabbana seduces fashion-savvy women and men all over the world with its glamorous luxury and elegant, playful silhouettes. Stars such as Madonna, Ben Affleck or Selena Gomez are dedicated fans of the premium brand, which is distinguished by its sophisticated design and skilful craftsmanship. Diverse patterns and vivid colour combinations provide the models their individual flair. Let yourself be enchanted with its luxurious chic blended with the Sicilian lifestyle.','2025-08-11 02:14:21',1,NULL,NULL,NULL,NULL),(14,'Emporio Armani','Noble elegance, austere contours and subtle colours define the collections of Emporio Armani. Giorgio Armani is one of the greatest fashion designers of the 20th century. After starting his career as a humble window dresser, he left his mark in fashion history with his pairing of jeans and jacket, the so-called Armani look. Since then, his creations have been highly sought after by celebrities, like Sean Connery, the actor who enjoys a legendary status and outfitted by the premium label. Its brand logo, a stylised eagle, represents strength, astuteness and grace and is therefore the perfect embodiment of the brand\'s values. Armani\'s designs are always classic and timeless, and will make you as radiant as the stars!','2025-08-11 02:14:55',1,NULL,NULL,NULL,NULL),(15,'Fendi','The Italian luxury brand Fendi started in 1918 as a small leather and fur shop in Rome and is now one of the world\'s biggest multinational luxury brands. The name Fendi came about in 1925 with the marriage of Adele and Edoardo Fendi. In the 1960s, Karl Lagerfeld became the creative mind behind the designs. Lagerfeld introduced the famous FF logo, which still represents exclusivity, elegance and glamour today. The eyewear models by Fendi are characterised by their extraordinary and extravagant design. Sensual frame forms, striking colours and geometric accents - Fendi proves that it is still one of the most popular and exciting brands of the present day.','2025-08-11 02:15:23',1,NULL,NULL,NULL,NULL),(16,'Giorgio Armani','Elegant and stylish - the world-famous fashion label Giorgio Armani has been shaping the fashion world for many years. The fascination of the King of Fashion, as he is affectionately called by the media, is his sense for the luxurious, graceful and charming details. Be it Wayfarer, rectangular or butterfly frames - the blend of classic shapes and high-quality materials are combined in a unique symbiosis with lush colour palettes to create that incredibly special Armani look. Whether they are minimalist or trendy, matt or shiny - there is hardly a brand that carries as much sophistication and diversity as Armani. Combined with excellent wearing comfort, your perfect look is always guaranteed. Exclusive design and the love for the perfect finish - only with Giorgio Armani.','2025-08-11 02:15:54',1,NULL,NULL,NULL,NULL),(17,'Givenchy','The diverse sunglasses from the French brand Givenchy have enjoyed great popularity worldwide over the years. They are luxurious, elegant, expressive and most of all extraordinary. The man behind the iconic brand is Hubert James Taffin de Givenchy, who learned his appreciation for beautiful things from his mother - the rest is fashion history. Distinguished by their premium quality and a timeless design that effortlessly adapts to even the most sophisticated looks, the sunglasses by Givenchy captivate with their slender silhouettes, clean lines and, of course, elegance and femininity. The mix of rich colours and contrasting shades brings elegant luxury in the form of Parisian street fashion to the world, turning every woman into a glamorous diva.','2025-08-11 02:16:23',1,NULL,NULL,NULL,NULL),(18,'Levi\'s','What was intended as an invention for US workers in 1873 to provide them with functional and high-quality workwear, became an unprecedented global success story. Even today, the tradition-rich brand Levi\'s delights its customers all over the world with comfortable, high-quality and, above all, stylish jeanswear. The eyewear collections embody the strive for innovation and hip fashion. Classic shapes, modern approaches and soft colours are combined to create a look that is unpretentious, sophisticated and always up-to-date. Making it a must-have for any fashionista, and true to Levi\'s motto: \"Quality never goes out of style\".','2025-08-11 02:16:56',1,NULL,NULL,NULL,NULL),(19,'Polo Ralph Lauren','It all began with a tie collection. Today, the fashion label is known around the world. Preppy is the new chic - Polo Ralph Laurenhas made this motto its own. Originally intended for polo - the sport- it has also received approval from fashion lovers, with its typical American style and sense of colours and shapes. A timeless collection with unique design and opulent materials result in the perfect mixture of modern and classic. The \"Polo\" lettering decorates the temples of the models and underlines their brand-oriented, elegant and luxurious style. These glasses are as versatile as their wearers and therefore belong to every sporty-elegant wardrobe.','2025-08-12 04:11:19',1,NULL,NULL,NULL,NULL),(20,'David Beckham','Newly launched on the market, the premium brand David Beckham is already making its mark. The successful footballer and world-famous fashion icon always dress modern and tasteful without pursuing the latest trends. The style of his eyewear is also a skilful fusion of design and craftsmanship. Drawing on the expertise of the traditional Italian company Safilo, he creates luxurious sunglasses and prescription eyewear with a striking and stylish design that offers the best workmanship and quality.','2025-08-12 04:19:35',1,NULL,NULL,'2025-08-12 04:19:51',1),(21,'Tom Ford','Tom Ford is one of the most popular and renowned eyewear designers in the world. The former Gucci designer has been designing a variety of very special collections under his own name for several years now. His models are luxurious, cool and glamorous. When designing his glasse, the designer focuses on warm, natural colours, predominantly using classic shapes and different materials such as plastic and leather. A luxurious touch and a bit of sparkle are brought about by by metallic, gold-coloured inserts on the hinges. This guarantees an exclusive and stylish finish.','2025-08-14 02:30:12',1,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `brand` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brand_lens`
--

DROP TABLE IF EXISTS `brand_lens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brand_lens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brand_lens`
--

LOCK TABLES `brand_lens` WRITE;
/*!40000 ALTER TABLE `brand_lens` DISABLE KEYS */;
INSERT INTO `brand_lens` VALUES (1,'Brand Lens','321','2025-09-17 15:19:00',1,NULL,NULL,NULL,NULL),(2,'Essilor','Tròng kính Essilor là thương hiệu số một về tròng kính mắt, được các chuyên gia nhãn khoa trên toàn thế giới khuyên dùng. \nChúng tôi mang đến giải pháp thị lực toàn diện đáp ứng mọi nhu cầu và lối sống.','2025-09-30 11:20:06',1,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `brand_lens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `cart_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `cart_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (7,1,'2025-09-30 13:29:00',1,'2025-09-30 13:29:00',1,NULL,NULL),(8,1,'2025-09-30 13:29:00',1,'2025-09-30 13:29:00',1,NULL,NULL),(9,2,'2025-10-08 15:03:11',2,'2025-10-08 15:03:11',2,NULL,NULL);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_frame`
--

DROP TABLE IF EXISTS `cart_frame`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_frame` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cart_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `selected_color_id` bigint DEFAULT NULL,
  `quantity` int DEFAULT '1',
  `frame_price` decimal(10,2) DEFAULT '0.00',
  `total_price` decimal(10,2) DEFAULT '0.00',
  `discount` decimal(10,2) DEFAULT '0.00',
  `added_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_frame_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `cart_frame_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `cart_frame_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `cart_frame_ibfk_4` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_frame`
--

LOCK TABLES `cart_frame` WRITE;
/*!40000 ALTER TABLE `cart_frame` DISABLE KEYS */;
INSERT INTO `cart_frame` VALUES (29,7,5,7,1,1000.00,1000.00,0.00,'2025-09-30 13:46:38','2025-09-30 13:46:38',1,'2025-09-30 13:46:38',1,'2025-09-30 13:48:57',1),(30,7,5,6,1,1000.00,1000.00,0.00,'2025-09-30 14:03:08','2025-09-30 14:03:08',1,'2025-09-30 14:03:08',1,'2025-09-30 14:24:55',1),(31,7,5,6,1,1000.00,1000.00,0.00,'2025-09-30 14:10:03','2025-09-30 14:10:03',1,'2025-09-30 14:10:03',1,'2025-09-30 14:35:19',1),(32,7,5,6,1,1000.00,1000.00,0.00,'2025-09-30 14:35:45','2025-09-30 14:35:45',1,'2025-09-30 14:35:45',1,'2025-09-30 15:57:49',1),(33,7,5,6,1,1000.00,1000.00,0.00,'2025-09-30 15:57:37','2025-09-30 15:57:37',1,'2025-09-30 15:57:37',1,'2025-09-30 18:17:35',1),(34,7,5,6,1,2000.00,2000.00,0.00,'2025-09-30 18:17:31','2025-09-30 18:17:31',1,'2025-09-30 18:17:31',1,'2025-09-30 19:20:02',1),(35,7,5,7,1,2000.00,2000.00,0.00,'2025-09-30 19:31:19','2025-09-30 19:31:19',1,'2025-09-30 19:31:19',1,'2025-09-30 19:47:17',1),(36,7,5,6,1,2000.00,2000.00,0.00,'2025-09-30 19:53:31','2025-09-30 19:53:31',1,'2025-09-30 19:53:31',1,'2025-09-30 21:01:18',1),(37,7,5,7,1,2000.00,2000.00,0.00,'2025-09-30 22:31:50','2025-09-30 22:31:50',1,'2025-09-30 22:31:50',1,'2025-09-30 22:33:10',1),(38,7,5,6,1,2000.00,2000.00,0.00,'2025-09-30 22:37:14','2025-09-30 22:37:14',1,'2025-09-30 22:37:14',1,'2025-10-01 11:51:04',1),(39,7,5,6,1,2000.00,2000.00,0.00,'2025-09-30 22:38:48','2025-09-30 22:38:48',1,'2025-09-30 22:38:48',1,'2025-10-01 11:39:35',1),(40,7,5,6,1,2000.00,2000.00,0.00,'2025-09-30 22:47:54','2025-09-30 22:47:54',1,'2025-09-30 22:47:54',1,'2025-10-01 11:39:33',1),(41,7,5,6,1,2000.00,2000.00,0.00,'2025-10-01 11:51:37','2025-10-01 11:51:37',1,'2025-10-01 11:51:37',1,'2025-10-01 15:05:00',1),(42,7,5,6,1,2000.00,2000.00,0.00,'2025-10-01 14:38:52','2025-10-01 14:38:52',1,'2025-10-01 14:38:52',1,'2025-10-01 15:05:00',1),(43,7,4,5,1,459000.00,459000.00,0.00,'2025-10-01 14:39:00','2025-10-01 14:39:00',1,'2025-10-01 14:39:00',1,'2025-10-01 15:05:00',1),(44,7,3,4,1,560000.00,560000.00,0.00,'2025-10-01 14:39:06','2025-10-01 14:39:06',1,'2025-10-01 14:39:06',1,'2025-10-01 15:05:00',1),(45,7,3,4,1,560000.00,560000.00,0.00,'2025-10-01 14:39:20','2025-10-01 14:39:20',1,'2025-10-01 14:39:20',1,'2025-10-01 15:05:00',1),(46,7,3,4,1,560000.00,560000.00,0.00,'2025-10-01 14:42:25','2025-10-01 14:42:25',1,'2025-10-01 14:42:25',1,'2025-10-01 15:05:00',1),(47,7,4,5,1,459000.00,459000.00,0.00,'2025-10-01 22:32:49','2025-10-01 22:32:49',1,'2025-10-01 22:32:49',1,'2025-10-02 13:11:34',1),(48,7,5,6,1,2000.00,2000.00,0.00,'2025-10-02 13:11:48','2025-10-02 13:11:48',1,'2025-10-02 13:11:48',1,'2025-10-02 13:16:27',1),(49,7,5,6,1,2000.00,2000.00,0.00,'2025-10-02 22:54:40','2025-10-02 22:54:40',1,'2025-10-02 22:54:40',1,'2025-10-08 00:27:47',1),(50,7,8,12,1,599000.00,599000.00,0.00,'2025-10-06 13:27:36','2025-10-06 13:27:36',1,'2025-10-06 13:27:36',1,'2025-10-08 00:27:49',1),(51,7,9,14,1,499000.00,499000.00,0.00,'2025-10-07 15:51:59','2025-10-07 15:51:59',1,'2025-10-07 15:51:59',1,NULL,NULL),(52,7,2,3,1,120000.00,120000.00,0.00,'2025-10-08 15:41:42','2025-10-08 15:41:42',1,'2025-10-08 15:41:42',1,NULL,NULL),(53,7,9,14,2,499000.00,998000.00,0.00,'2025-10-08 15:41:42','2025-10-08 15:41:42',1,'2025-10-08 15:41:42',1,NULL,NULL),(54,7,5,6,1,2000.00,2000.00,0.00,'2025-10-08 15:41:42','2025-10-08 15:41:42',1,'2025-10-08 15:41:42',1,NULL,NULL),(55,7,3,4,1,560000.00,560000.00,0.00,'2025-10-08 15:41:42','2025-10-08 15:41:42',1,'2025-10-08 15:41:42',1,NULL,NULL),(56,7,4,5,1,459000.00,459000.00,0.00,'2025-10-08 15:41:42','2025-10-08 15:41:42',1,'2025-10-08 15:41:42',1,NULL,NULL),(57,7,2,3,1,120000.00,120000.00,0.00,'2025-10-08 15:42:02','2025-10-08 15:42:02',1,'2025-10-08 15:42:02',1,NULL,NULL),(58,9,9,14,1,499000.00,499000.00,0.00,'2025-10-08 15:42:53','2025-10-08 15:42:53',2,'2025-10-08 15:42:53',2,'2025-10-08 16:09:29',2),(59,9,8,12,1,599000.00,599000.00,0.00,'2025-10-08 15:43:33','2025-10-08 15:43:33',2,'2025-10-08 15:43:33',2,'2025-10-08 15:49:33',2),(60,9,8,12,1,599000.00,599000.00,0.00,'2025-10-08 15:43:33','2025-10-08 15:43:33',2,'2025-10-08 15:43:33',2,'2025-10-08 15:49:34',2),(61,9,8,12,1,599000.00,599000.00,0.00,'2025-10-08 15:43:33','2025-10-08 15:43:33',2,'2025-10-08 15:43:33',2,'2025-10-08 15:49:35',2),(62,9,8,12,1,599000.00,599000.00,0.00,'2025-10-08 15:43:33','2025-10-08 15:43:33',2,'2025-10-08 15:43:33',2,'2025-10-08 15:49:36',2),(63,9,8,12,1,599000.00,599000.00,0.00,'2025-10-08 15:43:33','2025-10-08 15:43:33',2,'2025-10-08 15:43:33',2,'2025-10-08 15:49:37',2),(64,9,7,10,1,490000.00,490000.00,0.00,'2025-10-08 15:44:42','2025-10-08 15:44:42',2,'2025-10-08 15:44:42',2,'2025-10-08 15:49:27',2),(65,9,7,10,1,490000.00,490000.00,0.00,'2025-10-08 15:44:42','2025-10-08 15:44:42',2,'2025-10-08 15:44:42',2,'2025-10-08 15:49:28',2),(66,9,7,10,1,490000.00,490000.00,0.00,'2025-10-08 15:44:42','2025-10-08 15:44:42',2,'2025-10-08 15:44:42',2,'2025-10-08 15:49:29',2),(67,9,7,10,1,490000.00,490000.00,0.00,'2025-10-08 15:44:42','2025-10-08 15:44:42',2,'2025-10-08 15:44:42',2,'2025-10-08 15:49:31',2),(68,9,7,10,1,490000.00,490000.00,0.00,'2025-10-08 15:44:42','2025-10-08 15:44:42',2,'2025-10-08 15:44:42',2,'2025-10-08 15:49:32',2),(69,7,6,8,1,999000.00,999000.00,0.00,'2025-10-08 15:48:06','2025-10-08 15:48:06',1,'2025-10-08 15:48:06',1,NULL,NULL),(70,9,1,2,2,899000.00,1798000.00,0.00,'2025-10-08 15:48:51','2025-10-08 15:48:51',2,'2025-10-08 15:48:51',2,'2025-10-08 15:49:26',2),(71,9,5,6,1,2000.00,2000.00,0.00,'2025-10-08 15:53:22','2025-10-08 15:53:22',2,'2025-10-08 15:53:22',2,'2025-10-08 16:09:27',2),(72,9,7,10,1,490000.00,490000.00,0.00,'2025-10-08 15:56:38','2025-10-08 15:56:38',2,'2025-10-08 15:56:38',2,'2025-10-08 16:09:25',2),(73,9,9,14,1,499000.00,499000.00,0.00,'2025-10-08 16:09:32','2025-10-08 16:09:32',2,'2025-10-08 16:09:32',2,'2025-10-08 16:09:52',2),(74,9,9,14,1,499000.00,499000.00,0.00,'2025-10-08 21:24:43','2025-10-08 21:24:43',2,'2025-10-08 21:24:43',2,'2025-10-08 21:59:14',2),(75,9,9,14,1,499000.00,499000.00,0.00,'2025-10-08 22:00:47','2025-10-08 22:00:47',2,'2025-10-08 22:00:47',2,'2025-10-08 22:02:00',2),(76,9,5,6,1,2000.00,2000.00,0.00,'2025-10-08 22:01:32','2025-10-08 22:01:32',2,'2025-10-08 22:01:32',2,'2025-10-08 22:06:08',2),(77,7,8,12,1,599000.00,599000.00,0.00,'2025-10-10 21:16:47','2025-10-10 21:16:47',1,'2025-10-10 21:16:47',1,NULL,NULL),(78,7,8,12,1,599000.00,599000.00,0.00,'2025-10-10 21:17:46','2025-10-10 21:17:46',1,'2025-10-10 21:17:46',1,NULL,NULL),(79,9,5,6,1,2000.00,2000.00,0.00,'2025-10-10 21:18:38','2025-10-10 21:18:38',2,'2025-10-10 21:18:38',2,'2025-10-10 21:19:57',2),(80,7,9,14,1,499000.00,499000.00,0.00,'2025-10-18 11:27:28','2025-10-18 11:27:28',1,'2025-10-18 11:27:28',1,NULL,NULL),(81,9,9,14,1,499000.00,499000.00,0.00,'2025-10-20 23:57:14','2025-10-20 23:57:14',2,'2025-10-20 23:57:14',2,NULL,NULL),(82,7,9,14,1,499000.00,499000.00,0.00,'2025-10-27 15:20:18','2025-10-27 15:20:18',1,'2025-10-27 15:20:18',1,NULL,NULL),(83,7,9,14,1,499000.00,499000.00,0.00,'2025-11-19 09:13:32','2025-11-19 09:13:32',1,'2025-11-19 09:13:32',1,NULL,NULL);
/*!40000 ALTER TABLE `cart_frame` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_lens_detail`
--

DROP TABLE IF EXISTS `cart_lens_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_lens_detail` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cart_frame_id` bigint NOT NULL,
  `lens_variant_id` bigint NOT NULL,
  `right_eye_sphere` decimal(4,2) NOT NULL,
  `right_eye_cylinder` decimal(4,2) DEFAULT NULL,
  `right_eye_axis` int DEFAULT NULL,
  `left_eye_sphere` decimal(4,2) NOT NULL,
  `left_eye_cylinder` decimal(4,2) DEFAULT NULL,
  `left_eye_axis` int DEFAULT NULL,
  `pd_left` decimal(4,1) DEFAULT NULL,
  `pd_right` decimal(4,1) DEFAULT NULL,
  `add_left` decimal(4,2) DEFAULT NULL,
  `add_right` decimal(4,2) DEFAULT NULL,
  `lens_price` decimal(10,2) NOT NULL,
  `selected_coating_ids` text,
  `selected_tint_color_id` bigint DEFAULT NULL,
  `prescription_notes` text,
  `lens_notes` text,
  `manufacturing_notes` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cart_frame_id` (`cart_frame_id`),
  KEY `lens_variant_id` (`lens_variant_id`),
  CONSTRAINT `cart_lens_detail_ibfk_1` FOREIGN KEY (`cart_frame_id`) REFERENCES `cart_frame` (`id`),
  CONSTRAINT `cart_lens_detail_ibfk_2` FOREIGN KEY (`lens_variant_id`) REFERENCES `lens_variant` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_lens_detail`
--

LOCK TABLES `cart_lens_detail` WRITE;
/*!40000 ALTER TABLE `cart_lens_detail` DISABLE KEYS */;
INSERT INTO `cart_lens_detail` VALUES (26,29,28,0.00,0.00,0,0.00,0.00,0,31.5,31.5,1.75,1.00,1410000.00,'[12]',NULL,'Từ trang Lens Selection','Loại tròng: PROGRESSIVE',NULL,'2025-09-30 13:46:38',1,'2025-09-30 13:46:38',1,'2025-09-30 13:48:57',1),(27,30,28,0.00,0.00,0,0.00,0.00,0,31.5,31.5,1.75,1.25,1410000.00,'[13]',NULL,'Từ trang Lens Selection','Loại tròng: PROGRESSIVE',NULL,'2025-09-30 14:03:09',1,'2025-09-30 14:03:09',1,'2025-09-30 14:24:55',1),(28,31,28,0.00,0.00,0,0.00,0.00,0,31.5,31.5,1.00,1.25,1410000.00,'[13]',NULL,'Từ trang Lens Selection','Loại tròng: PROGRESSIVE',NULL,'2025-09-30 14:10:03',1,'2025-09-30 14:10:03',1,'2025-09-30 14:35:19',1),(29,32,28,1.50,0.00,0,0.00,0.00,0,31.5,31.5,1.25,1.00,1410000.00,'[13]',NULL,'Từ trang Lens Selection','Loại tròng: PROGRESSIVE',NULL,'2025-09-30 14:35:45',1,'2025-09-30 14:35:45',1,'2025-09-30 15:57:49',1),(30,33,25,0.00,0.00,0,0.00,0.00,0,31.5,31.5,0.00,0.00,0.00,'[11]',NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',NULL,'2025-09-30 15:57:37',1,'2025-09-30 15:57:37',1,'2025-09-30 18:17:35',1),(31,34,25,0.00,0.00,0,0.00,0.00,0,31.5,31.5,0.00,0.00,0.00,'[11]',NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',NULL,'2025-09-30 18:17:31',1,'2025-09-30 18:17:31',1,'2025-09-30 19:20:02',1),(32,35,25,2.25,0.00,0,0.50,0.00,0,31.5,31.5,2.00,2.25,0.00,'[11]',NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',NULL,'2025-09-30 19:31:19',1,'2025-09-30 19:31:19',1,'2025-09-30 19:47:17',1),(33,36,25,0.00,0.00,0,0.00,0.00,0,31.5,31.5,0.00,0.00,0.00,'[11]',NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',NULL,'2025-09-30 19:53:31',1,'2025-09-30 19:53:31',1,'2025-09-30 21:01:18',1),(34,37,25,0.00,0.00,0,0.00,0.00,0,31.5,31.5,0.00,0.00,0.00,'[11]',NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',NULL,'2025-09-30 22:31:50',1,'2025-09-30 22:31:50',1,'2025-09-30 22:33:10',1),(35,38,25,0.00,0.00,0,0.00,0.00,0,31.5,31.5,0.00,0.00,0.00,'[11]',NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',NULL,'2025-09-30 22:37:14',1,'2025-09-30 22:37:14',1,'2025-10-01 11:51:04',1),(36,39,25,0.00,0.00,0,0.00,0.00,0,31.5,31.5,0.00,0.00,0.00,'[11]',NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',NULL,'2025-09-30 22:38:48',1,'2025-09-30 22:38:48',1,'2025-10-01 11:39:35',1),(37,40,28,0.00,0.00,0,0.00,0.00,0,31.5,31.5,1.00,1.00,1410000.00,'[13]',NULL,'Từ trang Lens Selection','Loại tròng: PROGRESSIVE',NULL,'2025-09-30 22:47:54',1,'2025-09-30 22:47:54',1,'2025-10-01 11:39:33',1),(38,41,26,0.00,0.00,0,0.00,0.00,0,31.5,31.5,0.00,0.00,3379000.00,'[11]',NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',NULL,'2025-10-01 11:51:37',1,'2025-10-01 11:51:37',1,'2025-10-01 15:05:00',1),(39,48,27,0.00,0.00,0,0.00,0.00,0,31.5,31.5,0.00,0.00,0.00,'[11]',NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',NULL,'2025-10-02 13:11:48',1,'2025-10-02 13:11:48',1,'2025-10-02 13:16:27',1),(40,50,26,-4.00,0.00,0,0.00,0.00,0,31.5,31.5,0.00,0.00,3379000.00,'[11]',NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',NULL,'2025-10-06 13:27:36',1,'2025-10-06 13:27:36',1,'2025-10-08 00:27:49',1),(41,51,26,0.00,0.00,0,0.00,0.00,0,31.5,31.5,0.00,0.00,3379000.00,'[11]',NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',NULL,'2025-10-07 15:51:59',1,'2025-10-07 15:51:59',1,NULL,NULL),(42,57,27,0.00,0.00,0,0.00,0.00,0,31.5,31.5,0.00,0.00,0.00,'[11]',NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',NULL,'2025-10-08 15:42:02',1,'2025-10-08 15:42:02',1,NULL,NULL),(43,58,25,-4.00,0.00,0,-4.25,0.00,0,31.5,31.5,0.00,0.00,1899000.00,'[11]',NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',NULL,'2025-10-08 15:42:53',2,'2025-10-08 15:42:53',2,'2025-10-08 16:09:29',2),(44,71,26,-2.75,0.00,0,-2.50,0.00,0,31.5,31.5,0.00,0.00,3379000.00,'[11]',NULL,'Synced from localStorage','Loại tròng: SINGLE_VISION',NULL,'2025-10-08 15:53:22',2,'2025-10-08 15:53:22',2,'2025-10-08 16:09:27',2),(45,72,27,0.00,0.00,0,0.00,0.00,0,31.5,31.5,0.00,0.00,0.00,'[11]',NULL,'Synced from localStorage','Loại tròng: SINGLE_VISION',NULL,'2025-10-08 15:56:38',2,'2025-10-08 15:56:38',2,'2025-10-08 16:09:25',2),(46,75,26,0.00,0.00,0,0.00,0.00,0,31.5,31.5,0.00,0.00,3379000.00,'[11]',NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',NULL,'2025-10-08 22:00:47',2,'2025-10-08 22:00:47',2,'2025-10-08 22:02:00',2),(47,76,27,0.00,0.00,0,0.00,0.00,0,31.5,31.5,0.00,0.00,0.00,'[11]',NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',NULL,'2025-10-08 22:01:32',2,'2025-10-08 22:01:32',2,'2025-10-08 22:06:08',2),(48,78,26,-4.25,0.00,0,-3.25,0.00,0,31.5,31.5,0.00,0.00,3379000.00,'[11]',NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',NULL,'2025-10-10 21:17:46',1,'2025-10-10 21:17:46',1,NULL,NULL),(49,79,27,0.00,0.00,0,0.00,0.00,0,31.5,31.5,0.00,0.00,0.00,'[11]',NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',NULL,'2025-10-10 21:18:38',2,'2025-10-10 21:18:38',2,'2025-10-10 21:19:57',2),(50,80,26,-5.75,0.00,0,0.00,0.00,0,32.0,32.0,0.00,0.00,3379000.00,'[11]',NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',NULL,'2025-10-18 11:27:28',1,'2025-10-18 11:27:28',1,NULL,NULL),(51,83,27,0.00,0.00,0,0.00,0.00,0,32.0,32.0,0.00,0.00,0.00,'[11]',NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',NULL,'2025-11-19 09:13:32',1,'2025-11-19 09:13:32',1,NULL,NULL);
/*!40000 ALTER TABLE `cart_lens_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Kính Mắt Nam','','2025-08-11 02:20:47',1,NULL,NULL,NULL,NULL,NULL),(2,'Kính Mắt Nữ','','2025-08-11 02:20:55',1,NULL,NULL,NULL,NULL,NULL),(3,'Kính đọc sách','','2025-08-11 02:27:00',1,NULL,NULL,NULL,NULL,NULL),(4,'Kính đa tiêu','Gọng kính phù hợp cho cận, viễn, loạn.','2025-09-03 22:30:30',1,NULL,NULL,NULL,NULL,NULL),(5,'Men\'s Sunglasses','','2025-10-01 13:58:43',1,NULL,NULL,NULL,NULL,NULL),(6,'Women\'s Sunglasses','','2025-10-01 13:58:54',1,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_lens`
--

DROP TABLE IF EXISTS `category_lens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_lens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_lens`
--

LOCK TABLES `category_lens` WRITE;
/*!40000 ALTER TABLE `category_lens` DISABLE KEYS */;
INSERT INTO `category_lens` VALUES (1,'321','321','2025-09-17 15:24:21',1,NULL,NULL,'2025-09-30 11:25:58',1),(2,'Tròng đổi màu','Tròng kính đổi màu khi tiếp xúc với môi trường ngoài tự nhiên.','2025-09-30 11:21:56',1,NULL,NULL,NULL,NULL),(3,'Tròng lái xe','Tròng kính phù hợp cho việc lái xe, di chuyển nhiều trên đường. Giúp chống chói, chống lóa của đèn đường và đèn xe khi đi ban đêm.','2025-09-30 11:22:47',1,NULL,NULL,NULL,NULL),(4,'Tròng chống ánh sáng xanh','Tròng giảm thiểu ánh sáng xanh gây hại cho mắt. Phù hợp với người làm việc nhiều với màn hình, giúp giảm căng thẳng lên mắt.','2025-09-30 11:24:18',1,NULL,NULL,NULL,NULL),(5,'Tròng siêu mỏng','Tròng kính siêu mỏng giúp cho khối lượng tổng thể của mắt kính trở nên nhẹ hơn, giảm áp lực lên tai, mũi và thoải mái khi mang lâu.','2025-09-30 11:25:38',1,NULL,NULL,NULL,NULL),(6,'Tròng chống xước','Tròng có độ chống trầy xước cao.','2025-09-30 11:27:20',1,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `category_lens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `color_skin_recommendation`
--

DROP TABLE IF EXISTS `color_skin_recommendation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `color_skin_recommendation` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_color_id` bigint DEFAULT NULL,
  `skin_color_type` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_color_id` (`product_color_id`),
  CONSTRAINT `color_skin_recommendation_ibfk_1` FOREIGN KEY (`product_color_id`) REFERENCES `product_color` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `color_skin_recommendation`
--

LOCK TABLES `color_skin_recommendation` WRITE;
/*!40000 ALTER TABLE `color_skin_recommendation` DISABLE KEYS */;
INSERT INTO `color_skin_recommendation` VALUES (1,2,'dark','2025-10-03 00:24:14',1,'2025-10-03 00:24:14',1,NULL,NULL),(2,3,'medium','2025-10-03 00:41:54',1,'2025-10-03 00:41:54',1,NULL,NULL),(3,3,'dark','2025-10-03 00:41:54',1,'2025-10-03 00:41:54',1,NULL,NULL),(4,3,'light','2025-10-03 00:43:34',1,'2025-10-03 00:43:34',1,NULL,NULL),(5,4,'medium','2025-10-03 00:47:39',1,'2025-10-03 00:47:39',1,NULL,NULL),(6,5,'dark','2025-10-06 12:13:27',1,'2025-10-06 12:13:27',1,NULL,NULL),(7,6,'medium','2025-10-06 12:39:16',1,'2025-10-06 12:39:16',1,NULL,NULL),(8,7,'light','2025-10-06 12:39:16',1,'2025-10-06 12:39:16',1,NULL,NULL),(9,7,'medium','2025-10-06 12:39:16',1,'2025-10-06 12:39:16',1,NULL,NULL),(10,8,'dark','2025-10-06 12:39:38',1,'2025-10-06 12:39:38',1,NULL,NULL),(11,8,'medium','2025-10-06 12:39:38',1,'2025-10-06 12:39:38',1,NULL,NULL),(12,9,'light','2025-10-06 12:39:38',1,'2025-10-06 12:39:38',1,NULL,NULL),(13,9,'medium','2025-10-06 12:39:38',1,'2025-10-06 12:39:38',1,NULL,NULL),(14,10,'medium','2025-10-06 12:39:56',1,'2025-10-06 12:39:56',1,NULL,NULL),(15,10,'dark','2025-10-06 12:39:56',1,'2025-10-06 12:39:56',1,NULL,NULL),(16,11,'medium','2025-10-06 12:39:56',1,'2025-10-06 12:39:56',1,NULL,NULL),(17,11,'light','2025-10-06 12:39:56',1,'2025-10-06 12:39:56',1,NULL,NULL),(18,12,'medium','2025-10-06 12:40:06',1,'2025-10-06 12:40:06',1,NULL,NULL),(19,12,'dark','2025-10-06 12:40:06',1,'2025-10-06 12:40:06',1,NULL,NULL),(20,13,'medium','2025-10-06 12:40:06',1,'2025-10-06 12:40:06',1,NULL,NULL),(21,13,'dark','2025-10-06 12:40:06',1,'2025-10-06 12:40:06',1,NULL,NULL);
/*!40000 ALTER TABLE `color_skin_recommendation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_template`
--

DROP TABLE IF EXISTS `email_template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_template` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `html` text,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_template`
--

LOCK TABLES `email_template` WRITE;
/*!40000 ALTER TABLE `email_template` DISABLE KEYS */;
INSERT INTO `email_template` VALUES (2,'reset-password','Reset Your Password - NestJS App','<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Reset Your Password</title>\n    <style>\n        body {\n            font-family: Arial, sans-serif;\n            line-height: 1.6;\n            color: #333;\n            max-width: 600px;\n            margin: 0 auto;\n            padding: 20px;\n        }\n        .container {\n            background-color: #f9f9f9;\n            padding: 30px;\n            border-radius: 10px;\n            box-shadow: 0 4px 6px rgba(0,0,0,0.1);\n        }\n        .header {\n            text-align: center;\n            margin-bottom: 30px;\n        }\n        .header h1 {\n            color: #2c3e50;\n            margin: 0;\n        }\n        .content {\n            background-color: #fff;\n            padding: 30px;\n            border-radius: 8px;\n            margin-bottom: 20px;\n        }\n        .button {\n            display: inline-block;\n            padding: 12px 30px;\n            background-color: #3498db;\n            color: #fff;\n            text-decoration: none;\n            border-radius: 5px;\n            font-weight: bold;\n            margin: 20px 0;\n        }\n        .button:hover {\n            background-color: #2980b9;\n        }\n        .footer {\n            text-align: center;\n            color: #7f8c8d;\n            font-size: 14px;\n        }\n        .warning {\n            background-color: #fff3cd;\n            border: 1px solid #ffeaa7;\n            color: #856404;\n            padding: 15px;\n            border-radius: 5px;\n            margin: 20px 0;\n        }\n    </style>\n</head>\n<body>\n    <div class=\"container\">\n        <div class=\"header\">\n            <h1>🔒 Password Reset Request</h1>\n        </div>\n        \n        <div class=\"content\">\n            <h2>Hello {{username}},</h2>\n            \n            <p>We received a request to reset your password for your NestJS App account. If you made this request, click the button below to reset your password:</p>\n            \n            <div style=\"text-align: center;\">\n                <a href=\"{{resetUrl}}\" class=\"button\">Reset Password</a>\n            </div>\n            \n            <div class=\"warning\">\n                <strong>⚠️ Important:</strong><br>\n                This link will expire in <strong>{{expiresIn}}</strong> for security reasons.\n            </div>\n            \n            <p>If you didn\'t request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>\n            \n            <p>For security reasons, this link can only be used once and will expire soon.</p>\n        </div>\n        \n        <div class=\"footer\">\n            <p>© 2025 NestJS App. All rights reserved.</p>\n            <p>If you\'re having trouble clicking the button, copy and paste the URL below into your web browser:</p>\n            <p style=\"word-break: break-all; color: #3498db;\">{{resetUrl}}</p>\n        </div>\n    </div>\n</body>\n</html>','Template for password reset email with professional design','2025-09-03 14:35:36',1,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `email_template` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `face_analysis`
--

DROP TABLE IF EXISTS `face_analysis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `face_analysis` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `session_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `image_s3_key` varchar(255) DEFAULT NULL,
  `detected_gender_type` varchar(255) DEFAULT NULL,
  `gender_confidence` double DEFAULT NULL,
  `detected_skin_color_type` varchar(255) DEFAULT NULL,
  `skin_color_confidence` double DEFAULT NULL,
  `detected_face_shape_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `face_shape_confidence` double DEFAULT NULL,
  `analysis_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  `error_message` varchar(100) DEFAULT NULL,
  `processing_time_ms` double DEFAULT NULL,
  `analysis_metadata` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `session_id` (`session_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `face_analysis_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`),
  CONSTRAINT `face_analysis_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=139 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `face_analysis`
--

LOCK TABLES `face_analysis` WRITE;
/*!40000 ALTER TABLE `face_analysis` DISABLE KEYS */;
INSERT INTO `face_analysis` VALUES (1,36,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/36/1757732119555-analysis.jpg','ai-analysis/36/1757732119555-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'processing',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'{\"format\": \"jpeg\"}'),(2,37,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/37/1757732672831-analysis.jpg','ai-analysis/37/1757732672831-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'processing',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'{\"format\": \"jpeg\"}'),(3,38,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/38/1757733826710-analysis.jpg','ai-analysis/38/1757733826710-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1747,'{\"format\": \"jpeg\"}'),(4,39,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/39/1757733966466-analysis.jpg','ai-analysis/39/1757733966466-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1357,'{\"format\": \"jpeg\"}'),(5,40,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/40/1757734081378-analysis.jpg','ai-analysis/40/1757734081378-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,2047,'{\"format\": \"jpeg\"}'),(6,41,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/41/1757734484393-analysis.jpg','ai-analysis/41/1757734484393-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,4462,'{\"format\": \"jpeg\"}'),(7,42,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/42/1757734580372-analysis.jpg','ai-analysis/42/1757734580372-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,3452,'{\"format\": \"jpeg\"}'),(8,43,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/43/1757734712072-analysis.jpg','ai-analysis/43/1757734712072-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,4060,'{\"format\": \"jpeg\"}'),(9,44,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/44/1757734979036-analysis.jpg','ai-analysis/44/1757734979036-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5799,'{\"format\": \"jpeg\"}'),(10,45,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/45/1757735014399-analysis.jpg','ai-analysis/45/1757735014399-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,4271,'{\"format\": \"jpeg\"}'),(11,46,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/46/1757735486529-analysis.jpg','ai-analysis/46/1757735486529-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,4976,'{\"format\": \"jpeg\"}'),(12,47,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/47/1757735604282-analysis.jpg','ai-analysis/47/1757735604282-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5345,'{\"format\": \"jpeg\"}'),(13,48,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/48/1757735736960-analysis.jpg','ai-analysis/48/1757735736960-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,4725,'{\"format\": \"jpeg\"}'),(14,49,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/49/1757736419268-analysis.jpg','ai-analysis/49/1757736419268-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5000,'{\"format\": \"jpeg\"}'),(15,50,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/50/1757736565603-analysis.jpg','ai-analysis/50/1757736565603-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,4717,'{\"format\": \"jpeg\"}'),(16,51,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/51/1757736602356-analysis.jpg','ai-analysis/51/1757736602356-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,4856,'{\"format\": \"jpeg\"}'),(17,52,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/52/1757736719126-analysis.jpg','ai-analysis/52/1757736719126-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5474,'{\"format\": \"jpeg\"}'),(18,53,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/53/1757736935350-analysis.jpg','ai-analysis/53/1757736935350-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5332,'{\"format\": \"jpeg\"}'),(19,54,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/54/1757736972656-analysis.jpg','ai-analysis/54/1757736972656-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5499,'{\"format\": \"jpeg\"}'),(20,55,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/55/1757737145849-analysis.jpg','ai-analysis/55/1757737145849-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,8197,'{\"format\": \"jpeg\"}'),(21,56,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/56/1757737233732-analysis.jpg','ai-analysis/56/1757737233732-analysis.jpg','female',0,'medium',0,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,4842,'{\"format\": \"jpeg\"}'),(22,57,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/57/1757737824292-analysis.jpg','ai-analysis/57/1757737824292-analysis.jpg','female',0,'medium',0,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5681,'{\"format\": \"jpeg\"}'),(23,58,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/58/1757737848181-analysis.jpg','ai-analysis/58/1757737848181-analysis.jpg','female',0,'medium',0,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,4724,'{\"format\": \"jpeg\"}'),(24,59,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/59/1757737920438-analysis.jpg','ai-analysis/59/1757737920438-analysis.jpg','female',0,'medium',0,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,6437,'{\"format\": \"jpeg\"}'),(25,60,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/60/1757738050944-analysis.jpg','ai-analysis/60/1757738050944-analysis.jpg','female',0.9962369203567505,'medium',0.9,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5445,'{\"format\": \"jpeg\"}'),(26,61,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/61/1757738975238-analysis.jpg','ai-analysis/61/1757738975238-analysis.jpg','female',0.9962369203567505,'medium',0.9,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5774,'{\"format\": \"jpeg\"}'),(27,62,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/62/1757739055172-analysis.jpg','ai-analysis/62/1757739055172-analysis.jpg','female',0.9962369203567505,'medium',0.9,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,4648,'{\"format\": \"jpeg\"}'),(28,63,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/63/1757739388118-analysis.jpg','ai-analysis/63/1757739388118-analysis.jpg','female',0.9745803475379944,'light',0.9,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,4188,'{\"format\": \"jpeg\"}'),(29,64,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/64/1757910392386-analysis.jpg','ai-analysis/64/1757910392386-analysis.jpg','female',0.8824893236160278,'medium',0.9,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,8738,'{\"format\": \"jpeg\"}'),(30,65,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/65/1757910479332-analysis.jpg','ai-analysis/65/1757910479332-analysis.jpg','male',0.8596314787864685,'medium',0.9,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7039,'{\"format\": \"jpeg\"}'),(31,66,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/66/1757910533800-analysis.jpg','ai-analysis/66/1757910533800-analysis.jpg','male',0.6999721527099609,'dark',0.9,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7681,'{\"format\": \"jpeg\"}'),(32,67,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/67/1757910650201-analysis.jpg','ai-analysis/67/1757910650201-analysis.jpg','male',0.761788547039032,'medium',0.9,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,6765,'{\"format\": \"jpeg\"}'),(33,68,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/68/1757922778136-analysis.jpg','ai-analysis/68/1757922778136-analysis.jpg','male',0.9981485605239868,'dark',0.9,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,9579,'{\"format\": \"jpeg\"}'),(34,69,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/69/1757927455546-analysis.jpg','ai-analysis/69/1757927455546-analysis.jpg','male',0.9581770300865173,'medium',0.9,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,8968,'{\"format\": \"jpeg\"}'),(35,70,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/70/1757930049623-analysis.jpg','ai-analysis/70/1757930049623-analysis.jpg','female',1,'light',0.9,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,6867,'{\"format\": \"jpeg\"}'),(36,71,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/71/1757930495811-analysis.jpg','ai-analysis/71/1757930495811-analysis.jpg','male',0.9248800277709961,'dark',0.9,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5020,'{\"format\": \"jpeg\"}'),(37,72,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/72/1757930565673-analysis.jpg','ai-analysis/72/1757930565673-analysis.jpg','female',0.5198096632957458,'dark',0.9,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,4905,'{\"format\": \"jpeg\"}'),(38,73,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/73/1757930590695-analysis.jpg','ai-analysis/73/1757930590695-analysis.jpg','male',0.9999668598175049,'dark',0.9,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5853,'{\"format\": \"jpeg\"}'),(39,74,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/74/1757990840130-analysis.jpg','ai-analysis/74/1757990840130-analysis.jpg','male',0.7790894508361816,'dark',0.9,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,9105,'{\"format\": \"jpeg\"}'),(40,75,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/75/1757991204413-analysis.jpg','ai-analysis/75/1757991204413-analysis.jpg','male',0.9659157395362854,'medium',0.9,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,6915,'{\"format\": \"jpeg\"}'),(41,76,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/76/1758081746864-analysis.jpg','ai-analysis/76/1758081746864-analysis.jpg','male',0.9959704875946045,'medium',0.9,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,8990,'{\"format\": \"jpeg\"}'),(42,77,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/77/1758095487980-analysis.jpg','ai-analysis/77/1758095487980-analysis.jpg','male',0.9999545812606812,'dark',0.9,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,10143,'{\"format\": \"jpeg\"}'),(43,78,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/78/1758255468652-analysis.jpg','ai-analysis/78/1758255468652-analysis.jpg','male',0.9868304133415222,'dark',0.9,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,9078,'{\"format\": \"jpeg\"}'),(44,79,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/79/1758255500844-analysis.jpg','ai-analysis/79/1758255500844-analysis.jpg','male',0.9889167547225952,'medium',0.9,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5627,'{\"format\": \"jpeg\"}'),(45,80,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/80/1758255533083-analysis.jpg','ai-analysis/80/1758255533083-analysis.jpg','male',0.5952876210212708,'dark',0.9,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5029,'{\"format\": \"jpeg\"}'),(46,85,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/85/1758984593761-analysis.jpg','ai-analysis/85/1758984593761-analysis.jpg','male',0.9911800026893616,'dark',0.9,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7163,'{\"format\": \"jpeg\"}'),(47,86,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/86/1758984620586-analysis.jpg','ai-analysis/86/1758984620586-analysis.jpg','female',0.9871358275413513,'light',0.9,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5859,'{\"format\": \"jpeg\"}'),(48,97,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/97/1759333883095-analysis.jpg','ai-analysis/97/1759333883095-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,2999,'{\"format\": \"jpeg\"}'),(49,98,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/98/1759333900973-analysis.jpg','ai-analysis/98/1759333900973-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1296,'{\"format\": \"jpeg\"}'),(50,99,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/99/1759333930241-analysis.jpg','ai-analysis/99/1759333930241-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1288,'{\"format\": \"jpeg\"}'),(51,100,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/100/1759334018494-analysis.jpg','ai-analysis/100/1759334018494-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1383,'{\"format\": \"jpeg\"}'),(52,101,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/101/1759334053135-analysis.jpg','ai-analysis/101/1759334053135-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1339,'{\"format\": \"jpeg\"}'),(53,102,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/102/1759334073515-analysis.jpg','ai-analysis/102/1759334073515-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1373,'{\"format\": \"jpeg\"}'),(54,103,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/103/1759334077274-analysis.jpg','ai-analysis/103/1759334077274-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1018,'{\"format\": \"jpeg\"}'),(55,104,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/104/1759334229244-analysis.jpg','ai-analysis/104/1759334229244-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1548,'{\"format\": \"jpeg\"}'),(56,105,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/105/1759334377428-analysis.jpg','ai-analysis/105/1759334377428-analysis.jpg','male',0.996324360370636,'medium',0.9,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7489,'{\"format\": \"jpeg\"}'),(57,106,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/106/1759334764016-analysis.jpg','ai-analysis/106/1759334764016-analysis.jpg','male',0.9988135099411011,'dark',0.9,NULL,NULL,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7619,'{\"format\": \"jpeg\"}'),(58,107,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/107/1759390691486-analysis.jpg','ai-analysis/107/1759390691486-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5279,'{\"format\": \"jpeg\"}'),(59,108,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/108/1759390842899-analysis.jpg','ai-analysis/108/1759390842899-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,2626,'{\"format\": \"jpeg\"}'),(60,109,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/109/1759391190732-analysis.jpg','ai-analysis/109/1759391190732-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1323,'{\"format\": \"jpeg\"}'),(61,110,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/110/1759391222207-analysis.jpg','ai-analysis/110/1759391222207-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'failed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,2524,'{\"format\": \"jpeg\"}'),(62,111,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/111/1759391903926-analysis.jpg','ai-analysis/111/1759391903926-analysis.jpg','male',0.9988777041435242,'dark',0.9,'heart',0.4524,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,6958,'{\"format\": \"jpeg\"}'),(63,112,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/112/1759391962255-analysis.jpg','ai-analysis/112/1759391962255-analysis.jpg','female',0.5949578881263733,'dark',0.9,'round',0.9354,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5903,'{\"format\": \"jpeg\"}'),(64,117,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/117/1759462345851-analysis.jpg','ai-analysis/117/1759462345851-analysis.jpg','male',0.9997245669364929,'dark',0.9,'oblong',0.4402,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,8174,'{\"format\": \"jpeg\"}'),(65,118,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/118/1759462477774-analysis.jpg','ai-analysis/118/1759462477774-analysis.jpg','male',0.9999854564666748,'dark',0.9,'oblong',0.6631,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7114,'{\"format\": \"jpeg\"}'),(66,119,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/119/1759462501570-analysis.jpg','ai-analysis/119/1759462501570-analysis.jpg','male',0.9933391213417053,'dark',0.9,'round',0.9878,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5884,'{\"format\": \"jpeg\"}'),(67,120,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/120/1759468950581-analysis.jpg','ai-analysis/120/1759468950581-analysis.jpg','male',0.9999281167984009,'medium',0.9,'square',0.7326,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,6369,'{\"format\": \"jpeg\"}'),(68,121,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/121/1759469409211-analysis.jpg','ai-analysis/121/1759469409211-analysis.jpg','male',0.9945868253707886,'medium',0.9,'round',0.6928,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,6251,'{\"format\": \"jpeg\"}'),(69,122,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/122/1759469431749-analysis.jpg','ai-analysis/122/1759469431749-analysis.jpg','male',0.997776448726654,'medium',0.9,'round',0.859,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7173,'{\"format\": \"jpeg\"}'),(70,123,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/123/1759470522574-analysis.jpg','ai-analysis/123/1759470522574-analysis.jpg','male',0.993191659450531,'medium',0.9,'oblong',0.6745,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7291,'{\"format\": \"jpeg\"}'),(71,124,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/124/1759470848119-analysis.jpg','ai-analysis/124/1759470848119-analysis.jpg','male',0.9999144077301025,'light',0.9,'heart',0.6949,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,6241,'{\"format\": \"jpeg\"}'),(72,125,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/125/1759471270487-analysis.jpg','ai-analysis/125/1759471270487-analysis.jpg','male',0.9955154061317444,'dark',0.9,'square',0.3729,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7604,'{\"format\": \"jpeg\"}'),(73,126,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/126/1759471472270-analysis.jpg','ai-analysis/126/1759471472270-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'processing',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'{\"format\": \"jpeg\"}'),(74,127,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/127/1759471631901-analysis.jpg','ai-analysis/127/1759471631901-analysis.jpg','male',0.999543309211731,'medium',0.9,'heart',0.4734,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,8487,'{\"format\": \"jpeg\"}'),(75,128,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/128/1759472003824-analysis.jpg','ai-analysis/128/1759472003824-analysis.jpg','male',0.9718994498252869,'medium',0.9,'round',0.4946,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7788,'{\"format\": \"jpeg\"}'),(76,129,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/129/1759472175230-analysis.jpg','ai-analysis/129/1759472175230-analysis.jpg','male',0.9910005927085876,'medium',0.9,'round',0.7051,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7648,'{\"format\": \"jpeg\"}'),(77,130,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/130/1759472297846-analysis.jpg','ai-analysis/130/1759472297846-analysis.jpg','male',0.9995971322059631,'medium',0.9,'round',0.9505,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7215,'{\"format\": \"jpeg\"}'),(78,131,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/131/1759472528381-analysis.jpg','ai-analysis/131/1759472528381-analysis.jpg','male',0.9972730278968811,'unknown',0.9,'heart',0.5125,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,6135,'{\"format\": \"jpeg\"}'),(79,132,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/132/1759472713744-analysis.jpg','ai-analysis/132/1759472713744-analysis.jpg','female',1,'light',0.9,'round',0.7905,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,9926,'{\"format\": \"jpeg\"}'),(80,133,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/133/1759472878050-analysis.jpg','ai-analysis/133/1759472878050-analysis.jpg','male',0.9986374974250793,'unknown',0.9,'heart',0.5177,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7569,'{\"format\": \"jpeg\"}'),(81,134,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/134/1759473031152-analysis.jpg','ai-analysis/134/1759473031152-analysis.jpg','male',0.9662352204322815,'dark',0.9,'square',0.7487,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5564,'{\"format\": \"jpeg\"}'),(82,135,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/135/1759473535105-analysis.jpg','ai-analysis/135/1759473535105-analysis.jpg','male',0.9892277717590332,'medium',0.9,'heart',0.4471,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,6370,'{\"format\": \"jpeg\"}'),(83,136,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/136/1759473847551-analysis.jpg','ai-analysis/136/1759473847551-analysis.jpg','male',0.9999991655349731,'medium',0.9,'round',0.96,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5888,'{\"format\": \"jpeg\"}'),(84,137,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/137/1759474127387-analysis.jpg','ai-analysis/137/1759474127387-analysis.jpg','male',0.9999982118606567,'light',0.9,'round',0.9819,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,4801,'{\"format\": \"jpeg\"}'),(85,138,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/138/1759474345112-analysis.jpg','ai-analysis/138/1759474345112-analysis.jpg','male',0.9997984766960144,'dark',0.9,'round',0.9059,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5782,'{\"format\": \"jpeg\"}'),(86,139,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/139/1759474397777-analysis.jpg','ai-analysis/139/1759474397777-analysis.jpg','male',0.993047297000885,'light',0.9,'round',0.8994,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5646,'{\"format\": \"jpeg\"}'),(87,140,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/140/1759475060187-analysis.jpg','ai-analysis/140/1759475060187-analysis.jpg','male',0.999885082244873,'medium',0.9,'round',0.79,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7445,'{\"format\": \"jpeg\"}'),(88,141,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/141/1759727125331-analysis.jpg','ai-analysis/141/1759727125331-analysis.jpg','male',0.9985896944999695,'medium',0.9,'heart',0.4068,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7640,'{\"format\": \"jpeg\"}'),(89,142,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/142/1759729219354-analysis.jpg','ai-analysis/142/1759729219354-analysis.jpg','male',0.8285149931907654,'medium',0.9,'oblong',0.9999,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7368,'{\"format\": \"jpeg\"}'),(90,143,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/143/1759729239801-analysis.jpg','ai-analysis/143/1759729239801-analysis.jpg','male',0.9402002692222595,'medium',0.9,'oblong',0.9997,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,6452,'{\"format\": \"jpeg\"}'),(91,144,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/144/1759729263434-analysis.jpg','ai-analysis/144/1759729263434-analysis.jpg','female',0.6100553870201111,'light',0.9,'oblong',0.9868,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,6757,'{\"format\": \"jpeg\"}'),(92,145,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/145/1759729325952-analysis.jpg','ai-analysis/145/1759729325952-analysis.jpg','male',0.5660036206245422,'medium',0.9,'round',0.9926,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5390,'{\"format\": \"jpeg\"}'),(93,146,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/146/1759730325139-analysis.jpg','ai-analysis/146/1759730325139-analysis.jpg','female',0.8517354726791382,'medium',0.9,'round',0.9999,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7680,'{\"format\": \"jpeg\"}'),(94,147,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/147/1759730545956-analysis.jpg','ai-analysis/147/1759730545956-analysis.jpg','female',0.6830876469612122,'medium',0.9,'round',0.997,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7749,'{\"format\": \"jpeg\"}'),(95,148,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/148/1759730629022-analysis.jpg','ai-analysis/148/1759730629022-analysis.jpg','male',0.991967499256134,'medium',0.9,'oblong',0.526,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7039,'{\"format\": \"jpeg\"}'),(96,149,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/149/1759730664486-analysis.jpg','ai-analysis/149/1759730664486-analysis.jpg','male',0.9808403849601746,'medium',0.9,'round',0.9989,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5273,'{\"format\": \"jpeg\"}'),(97,150,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/150/1759730688191-analysis.jpg','ai-analysis/150/1759730688191-analysis.jpg','male',0.9246712327003479,'medium',0.9,'round',0.9228,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,6167,'{\"format\": \"jpeg\"}'),(98,153,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/153/1759825450836-analysis.jpg','ai-analysis/153/1759825450836-analysis.jpg','male',0.9993122816085815,'medium',0.9,'heart',0.8437,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7275,'{\"format\": \"jpeg\"}'),(99,155,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/155/1759826020645-analysis.jpg','ai-analysis/155/1759826020645-analysis.jpg',NULL,NULL,NULL,NULL,NULL,NULL,'processing',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'{\"format\": \"jpeg\"}'),(100,163,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/163/1759894458051-analysis.jpg','ai-analysis/163/1759894458051-analysis.jpg','male',0.9967052340507507,'dark',0.9,'round',0.9994,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7060,'{\"format\": \"jpeg\"}'),(101,164,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/164/1759894484455-analysis.jpg','ai-analysis/164/1759894484455-analysis.jpg','male',0.9999473094940186,'dark',0.9,'round',0.9927,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5076,'{\"format\": \"jpeg\"}'),(102,165,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/165/1759894837195-analysis.jpg','ai-analysis/165/1759894837195-analysis.jpg','male',0.9998350143432617,'medium',0.9,'round',0.8905,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7383,'{\"format\": \"jpeg\"}'),(103,166,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/166/1759894858672-analysis.jpg','ai-analysis/166/1759894858672-analysis.jpg','male',0.9982603192329407,'dark',0.9,'round',0.7622,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7219,'{\"format\": \"jpeg\"}'),(104,167,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/167/1759894883167-analysis.jpg','ai-analysis/167/1759894883167-analysis.jpg','male',0.8167821168899536,'dark',0.9,'round',0.9165,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5132,'{\"format\": \"jpeg\"}'),(105,168,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/168/1759894900561-analysis.jpg','ai-analysis/168/1759894900561-analysis.jpg','male',0.9995080232620239,'medium',0.9,'round',0.7097,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,8509,'{\"format\": \"jpeg\"}'),(106,169,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/169/1759895029446-analysis.jpg','ai-analysis/169/1759895029446-analysis.jpg','male',0.9999016523361206,'dark',0.9,'round',0.9464,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,8962,'{\"format\": \"jpeg\"}'),(107,170,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/170/1759895221354-analysis.jpg','ai-analysis/170/1759895221354-analysis.jpg','male',0.9972493052482605,'medium',0.9,'round',0.8355,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,8023,'{\"format\": \"jpeg\"}'),(108,171,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/171/1759895242944-analysis.jpg','ai-analysis/171/1759895242944-analysis.jpg','male',0.9268835783004761,'medium',0.9,'square',0.6794,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7800,'{\"format\": \"jpeg\"}'),(109,172,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/172/1759895293486-analysis.jpg','ai-analysis/172/1759895293486-analysis.jpg','male',0.9832587242126465,'dark',0.9,'square',0.4993,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,6468,'{\"format\": \"jpeg\"}'),(110,173,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/173/1759895809750-analysis.jpg','ai-analysis/173/1759895809750-analysis.jpg','male',0.9711067080497742,'dark',0.9,'round',0.9943,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,6580,'{\"format\": \"jpeg\"}'),(111,174,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/174/1759896027324-analysis.jpg','ai-analysis/174/1759896027324-analysis.jpg','male',0.9654532670974731,'medium',0.9,'round',0.9651,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5837,'{\"format\": \"jpeg\"}'),(112,175,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/175/1759896287007-analysis.jpg','ai-analysis/175/1759896287007-analysis.jpg','male',0.996787428855896,'medium',0.9,'round',0.9959,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7363,'{\"format\": \"jpeg\"}'),(113,190,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/190/1760101383892-analysis.jpg','ai-analysis/190/1760101383892-analysis.jpg','male',0.9999959468841553,'light',0.9,'round',0.7426,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,6952,'{\"format\": \"jpeg\"}'),(114,193,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/193/1760106027797-analysis.jpg','ai-analysis/193/1760106027797-analysis.jpg','male',0.9999996423721313,'light',0.9,'round',0.9785,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7602,'{\"format\": \"jpeg\"}'),(115,194,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/194/1760106401625-analysis.jpg','ai-analysis/194/1760106401625-analysis.jpg','male',0.9989155530929565,'light',0.9,'oval',0.5369,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5741,'{\"format\": \"jpeg\"}'),(116,196,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/196/1760759481963-analysis.jpg','ai-analysis/196/1760759481963-analysis.jpg','male',0.9993590712547302,'light',0.9,'round',0.996,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,8270,'{\"format\": \"jpeg\"}'),(117,205,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/205/1763400383587-analysis.jpg','ai-analysis/205/1763400383587-analysis.jpg','male',0.9771106243133545,'medium',0.9,'round',0.9687,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7241,'{\"format\": \"jpeg\"}'),(118,206,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/206/1763400771479-analysis.jpg','ai-analysis/206/1763400771479-analysis.jpg','male',0.9104081392288208,'dark',0.9,'round',0.7965,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7607,'{\"format\": \"jpeg\"}'),(119,207,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/207/1763400993905-analysis.jpg','ai-analysis/207/1763400993905-analysis.jpg','male',0.9838142395019531,'medium',0.9,'round',0.9782,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7631,'{\"format\": \"jpeg\"}'),(120,208,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/208/1763401019424-analysis.jpg','ai-analysis/208/1763401019424-analysis.jpg','female',0.6602040529251099,'dark',0.9,'square',0.9988,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,6803,'{\"format\": \"jpeg\"}'),(121,209,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/209/1763401049608-analysis.jpg','ai-analysis/209/1763401049608-analysis.jpg','male',0.9150716066360474,'medium',0.9,'heart',0.823,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5543,'{\"format\": \"jpeg\"}'),(122,210,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/210/1763538000341-analysis.jpg','ai-analysis/210/1763538000341-analysis.jpg','male',0.9990346431732178,'medium',0.9,'round',0.8668,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7685,'{\"format\": \"jpeg\"}'),(123,212,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/212/1763538307486-analysis.jpg','ai-analysis/212/1763538307486-analysis.jpg','male',0.8398880958557129,'light',0.9,'round',0.9661,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5280,'{\"format\": \"jpeg\"}'),(124,213,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/213/1763538425111-analysis.jpg','ai-analysis/213/1763538425111-analysis.jpg','male',0.9999113082885742,'light',0.9,'round',0.9888,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,6799,'{\"format\": \"jpeg\"}'),(125,214,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/214/1763538750345-analysis.jpg','ai-analysis/214/1763538750345-analysis.jpg','male',0.9999521970748901,'light',0.9,'round',0.8779,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5192,'{\"format\": \"jpeg\"}'),(126,215,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/215/1763538831652-analysis.jpg','ai-analysis/215/1763538831652-analysis.jpg','male',0.9983924031257629,'light',0.9,'oblong',0.5532,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7342,'{\"format\": \"jpeg\"}'),(127,216,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/216/1763538844965-analysis.jpg','ai-analysis/216/1763538844965-analysis.jpg','male',1,'light',0.9,'oval',0.9272,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,6168,'{\"format\": \"jpeg\"}'),(128,217,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/217/1763540101201-analysis.jpg','ai-analysis/217/1763540101201-analysis.jpg','female',0.6383136510848999,'medium',0.9,'square',0.9408,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5976,'{\"format\": \"jpeg\"}'),(129,218,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/218/1763540167782-analysis.jpg','ai-analysis/218/1763540167782-analysis.jpg','male',0.9723281264305115,'dark',0.9,'square',0.5729,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5199,'{\"format\": \"jpeg\"}'),(130,219,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/219/1763540195723-analysis.jpg','ai-analysis/219/1763540195723-analysis.jpg','male',0.9999992847442627,'light',0.9,'oblong',0.9281,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,4873,'{\"format\": \"jpeg\"}'),(131,220,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/220/1763540363707-analysis.jpg','ai-analysis/220/1763540363707-analysis.jpg','male',0.8511994481086731,'medium',0.9,'round',0.5223,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,7168,'{\"format\": \"jpeg\"}'),(132,221,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/221/1763540380231-analysis.jpg','ai-analysis/221/1763540380231-analysis.jpg','male',0.9997493624687195,'medium',0.9,'square',0.9907,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,6612,'{\"format\": \"jpeg\"}'),(133,222,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/222/1763540572743-analysis.jpg','ai-analysis/222/1763540572743-analysis.jpg','male',0.9998987913131714,'medium',0.9,'oblong',0.6656,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,8018,'{\"format\": \"jpeg\"}'),(134,223,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/223/1763540821412-analysis.jpg','ai-analysis/223/1763540821412-analysis.jpg','male',0.9996944665908813,'medium',0.9,'square',0.9552,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5165,'{\"format\": \"jpeg\"}'),(135,224,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/224/1763541388286-analysis.jpg','ai-analysis/224/1763541388286-analysis.jpg','male',0.9990733861923218,'medium',0.9,'square',0.9256,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5532,'{\"format\": \"jpeg\"}'),(136,225,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/225/1763541403410-analysis.jpg','ai-analysis/225/1763541403410-analysis.jpg','male',0.9982869029045105,'medium',0.9,'heart',0.3936,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5423,'{\"format\": \"jpeg\"}'),(137,226,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/226/1763541423057-analysis.jpg','ai-analysis/226/1763541423057-analysis.jpg','male',0.9995036125183105,'medium',0.9,'oblong',0.4391,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5240,'{\"format\": \"jpeg\"}'),(138,227,NULL,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/ai-analysis/227/1763541474220-analysis.jpg','ai-analysis/227/1763541474220-analysis.jpg','male',0.999032735824585,'medium',0.9,'round',0.3494,'completed',NULL,NULL,NULL,NULL,NULL,NULL,NULL,5002,'{\"format\": \"jpeg\"}');
/*!40000 ALTER TABLE `face_analysis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `face_shape`
--

DROP TABLE IF EXISTS `face_shape`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `face_shape` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `face_shape`
--

LOCK TABLES `face_shape` WRITE;
/*!40000 ALTER TABLE `face_shape` DISABLE KEYS */;
/*!40000 ALTER TABLE `face_shape` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lens`
--

DROP TABLE IF EXISTS `lens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `brand_lens_id` bigint DEFAULT NULL,
  `origin` varchar(255) DEFAULT NULL,
  `lens_type` varchar(255) DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `brand_lens_id` (`brand_lens_id`),
  CONSTRAINT `lens_ibfk_1` FOREIGN KEY (`brand_lens_id`) REFERENCES `brand_lens` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lens`
--

LOCK TABLES `lens` WRITE;
/*!40000 ALTER TABLE `lens` DISABLE KEYS */;
INSERT INTO `lens` VALUES (29,'Tròng kính Essilor Crizal Rock','IN_STOCK',2,'Pháp','SINGLE_VISION','Tròng kính Essilor Crizal Rock kính đơn tròng sẵn hạn chế trầy x3, ngăn ánh sáng xanh và tia UV vượt trội\n','2025-09-30 11:54:36',1,NULL,NULL,NULL,NULL),(30,'Tròng kính đa tròng Essilor Smart-Lens','IN_STOCK',2,'Pháp','PROGRESSIVE','Kính đa tròng Essilor Smart-Lens là giải pháp hỗ trợ thị lực tiên tiến và tiện dụng nhất hiện nay, được các chuyên gia nhãn khoa hàng đầu thế giới khuyên dùng đối với những người lão thị. Với công nghệ quang học vượt trội và dây chuyền sản xuất hiện đại độc quyền của Essilor (Pháp), tròng kính Essilor Smart Lens giúp tối ưu 3 vùng nhìn GẦN – TRUNG GIAN – XA liền mạch, linh hoạt, mượt mà. Chiếc kính 2 trong 1: kính cận và kính viễn mang đến trải nghiệm tầm nhìn sắc nét tự nhiên không giới hạn, tạo phong cách trẻ trung, năng động và sự tiện lợi, thoải mái cho người đeo.','2025-09-30 13:17:06',1,NULL,NULL,NULL,NULL),(31,'test','IN_STOCK',1,'Việt Nam','SINGLE_VISION','','2025-09-30 22:48:54',1,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `lens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lens_category`
--

DROP TABLE IF EXISTS `lens_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lens_category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `lens_id` bigint DEFAULT NULL,
  `category_lens_id` bigint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lens_id` (`lens_id`),
  KEY `lens_category_ibfk_1` (`category_lens_id`),
  CONSTRAINT `lens_category_ibfk_1` FOREIGN KEY (`category_lens_id`) REFERENCES `category_lens` (`id`),
  CONSTRAINT `lens_category_ibfk_2` FOREIGN KEY (`lens_id`) REFERENCES `lens` (`id`),
  CONSTRAINT `lens_category_ibfk_3` FOREIGN KEY (`category_lens_id`) REFERENCES `category_lens` (`id`),
  CONSTRAINT `lens_category_ibfk_4` FOREIGN KEY (`lens_id`) REFERENCES `lens` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lens_category`
--

LOCK TABLES `lens_category` WRITE;
/*!40000 ALTER TABLE `lens_category` DISABLE KEYS */;
INSERT INTO `lens_category` VALUES (32,29,4,'2025-09-30 11:54:36',1,NULL,NULL,NULL,NULL),(33,29,6,'2025-09-30 11:54:36',1,NULL,NULL,NULL,NULL),(34,29,5,'2025-09-30 11:54:36',1,NULL,NULL,NULL,NULL),(35,30,2,'2025-09-30 13:17:06',1,NULL,NULL,NULL,NULL),(36,30,4,'2025-09-30 13:17:06',1,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `lens_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lens_coating`
--

DROP TABLE IF EXISTS `lens_coating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lens_coating` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `lens_id` bigint DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lens_coating`
--

LOCK TABLES `lens_coating` WRITE;
/*!40000 ALTER TABLE `lens_coating` DISABLE KEYS */;
INSERT INTO `lens_coating` VALUES (11,29,'Crizal Rock',0.00,'Chống trầy cao','2025-09-30 11:54:37',1,NULL,NULL,NULL,NULL),(12,30,'Clear',0.00,'Tròng trong suốt','2025-09-30 13:17:06',1,NULL,NULL,NULL,NULL),(13,30,'Blue UV',600000.00,'Chống ánh sáng xanh, tia UV','2025-09-30 13:17:06',1,NULL,NULL,NULL,NULL),(14,31,'2222',2222.00,'','2025-09-30 22:48:54',1,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `lens_coating` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lens_image`
--

DROP TABLE IF EXISTS `lens_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lens_image` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `lens_id` bigint DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `image_order` varchar(255) DEFAULT NULL,
  `is_thumbnail` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lens_id` (`lens_id`),
  CONSTRAINT `lens_image_ibfk_1` FOREIGN KEY (`lens_id`) REFERENCES `lens` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lens_image`
--

LOCK TABLES `lens_image` WRITE;
/*!40000 ALTER TABLE `lens_image` DISABLE KEYS */;
INSERT INTO `lens_image` VALUES (15,29,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/lens/tr-ng-k-nh-essilor-crizal-rock-29/63a1c8bc5137dde0c96b1c4056153871-main-a.png','a',0,'2025-09-30 11:54:39',1,NULL,1,NULL,NULL),(16,29,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/lens/tr-ng-k-nh-essilor-crizal-rock-29/0df34b74e8b0075c7cb6a58f760f6644-main-b.png','b',0,'2025-09-30 11:54:39',1,NULL,1,NULL,NULL),(17,29,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/lens/tr-ng-k-nh-essilor-crizal-rock-29/6c744f43621199bc728a1daaf539d014-main-c.png','c',0,'2025-09-30 11:54:40',1,NULL,1,NULL,NULL),(18,29,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/lens/tr-ng-k-nh-essilor-crizal-rock-29/c0cfb758481275a3f3b03b12e654bae0-main-e.png','e',0,'2025-09-30 11:54:41',1,NULL,1,NULL,NULL),(19,29,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/lens/tr-ng-k-nh-essilor-crizal-rock-29/af685603da27b888811130a33bf565a2-main-d.png','d',0,'2025-09-30 11:54:43',1,NULL,1,NULL,NULL),(20,30,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/lens/tr-ng-k-nh-a-tr-ng-essilor-smart-lens-30/ESSILIOR+-+SMART+LENS.png','a',0,'2025-09-30 13:17:08',1,NULL,1,NULL,NULL),(21,30,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/lens/tr-ng-k-nh-a-tr-ng-essilor-smart-lens-30/9f14fc333030911d164cbcf5d933e526-main-b.jpg','b',0,'2025-09-30 13:17:09',1,NULL,1,NULL,NULL),(22,30,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/lens/tr-ng-k-nh-a-tr-ng-essilor-smart-lens-30/4539815a8db5f05522cee0010b2fe8ba-main-c.jpg','c',0,'2025-09-30 13:17:10',1,NULL,1,NULL,NULL),(23,31,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/lens/test-31/84f133a69c2b45711f576b3c8bab85e1-main-a.jpg','a',0,'2025-09-30 22:48:56',1,NULL,1,NULL,NULL);
/*!40000 ALTER TABLE `lens_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lens_refraction_range`
--

DROP TABLE IF EXISTS `lens_refraction_range`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lens_refraction_range` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `lens_variant_id` bigint DEFAULT NULL,
  `refraction_type` varchar(255) DEFAULT NULL,
  `min_value` decimal(6,2) DEFAULT NULL,
  `max_value` decimal(6,2) DEFAULT NULL,
  `step_value` decimal(6,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lens_variant_id` (`lens_variant_id`),
  CONSTRAINT `lens_refraction_range_ibfk_1` FOREIGN KEY (`lens_variant_id`) REFERENCES `lens_variant` (`id`),
  CONSTRAINT `lens_refraction_range_ibfk_2` FOREIGN KEY (`lens_variant_id`) REFERENCES `lens_variant` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lens_refraction_range`
--

LOCK TABLES `lens_refraction_range` WRITE;
/*!40000 ALTER TABLE `lens_refraction_range` DISABLE KEYS */;
INSERT INTO `lens_refraction_range` VALUES (27,27,'SPHERICAL',-8.00,6.00,0.25,'2025-09-30 11:54:36',1,NULL,NULL,NULL,NULL),(28,27,'CYLINDRICAL',-8.00,6.00,0.25,'2025-09-30 11:54:36',1,NULL,NULL,NULL,NULL),(29,27,'AXIS',0.00,180.00,1.00,'2025-09-30 11:54:36',1,NULL,NULL,NULL,NULL),(33,26,'SPHERICAL',-8.00,6.00,0.25,'2025-09-30 11:54:37',1,NULL,NULL,NULL,NULL),(34,26,'CYLINDRICAL',-8.00,6.00,0.25,'2025-09-30 11:54:37',1,NULL,NULL,NULL,NULL),(35,26,'AXIS',0.00,180.00,1.00,'2025-09-30 11:54:37',1,NULL,NULL,NULL,NULL),(36,28,'SPHERICAL',0.00,2.00,0.25,'2025-09-30 13:17:06',1,NULL,NULL,NULL,NULL),(37,28,'ADDITIONAL',1.00,3.00,0.25,'2025-09-30 13:17:06',1,NULL,NULL,NULL,NULL),(38,29,'SPHERICAL',-8.00,6.00,0.25,'2025-09-30 22:48:54',1,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `lens_refraction_range` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lens_thickness`
--

DROP TABLE IF EXISTS `lens_thickness`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lens_thickness` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `index_value` double DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lens_thickness`
--

LOCK TABLES `lens_thickness` WRITE;
/*!40000 ALTER TABLE `lens_thickness` DISABLE KEYS */;
INSERT INTO `lens_thickness` VALUES (1,'Tròng kính tiêu chuẩn',1.56,0.00,'Độ dày tròng kính tiêu chuẩn','2025-08-11 02:43:02',1,NULL,NULL,NULL,NULL),(2,'Tròng kính mỏng',1.6,120000.00,'Mỏng và nhẹ hơn 20% so với tiêu chuẩn','2025-08-11 02:43:16',1,NULL,NULL,NULL,NULL),(3,'Tròng kính rất mỏng',1.67,400000.00,'Cao cấp\nMỏng và nhẹ hơn 40% so với tiêu chuẩn','2025-08-11 02:43:43',1,NULL,NULL,NULL,NULL),(4,'Tròng kính siêu mỏng',1.74,700000.00,'Mỏng và nhẹ hơn 60% so với tiêu chuẩn','2025-08-11 02:44:01',1,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `lens_thickness` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lens_tint_color`
--

DROP TABLE IF EXISTS `lens_tint_color`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lens_tint_color` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `lens_variant_id` bigint DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `color_code` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lens_variant_id` (`lens_variant_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lens_tint_color`
--

LOCK TABLES `lens_tint_color` WRITE;
/*!40000 ALTER TABLE `lens_tint_color` DISABLE KEYS */;
INSERT INTO `lens_tint_color` VALUES (1,7,'AAAAAA',NULL,'#808080','2025-09-19 10:58:42',1,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `lens_tint_color` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lens_variant`
--

DROP TABLE IF EXISTS `lens_variant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lens_variant` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `lens_id` bigint DEFAULT NULL,
  `lens_thickness_id` bigint DEFAULT NULL,
  `design` varchar(255) DEFAULT NULL,
  `material` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lens_id` (`lens_id`),
  KEY `lens_thickness_id` (`lens_thickness_id`),
  CONSTRAINT `lens_variant_ibfk_1` FOREIGN KEY (`lens_id`) REFERENCES `lens` (`id`),
  CONSTRAINT `lens_variant_ibfk_2` FOREIGN KEY (`lens_thickness_id`) REFERENCES `lens_thickness` (`id`),
  CONSTRAINT `lens_variant_ibfk_3` FOREIGN KEY (`lens_id`) REFERENCES `lens` (`id`),
  CONSTRAINT `lens_variant_ibfk_4` FOREIGN KEY (`lens_thickness_id`) REFERENCES `lens_thickness` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lens_variant`
--

LOCK TABLES `lens_variant` WRITE;
/*!40000 ALTER TABLE `lens_variant` DISABLE KEYS */;
INSERT INTO `lens_variant` VALUES (25,29,2,'NONE','POLYCARBONATE',1899000.00,10,'2025-09-30 11:54:36',1,NULL,NULL,NULL,NULL),(26,29,3,'NONE','POLYCARBONATE',3379000.00,11,'2025-09-30 11:54:36',1,'2025-10-09 06:10:06',1,NULL,NULL),(27,29,1,'NONE','POLYCARBONATE',0.00,8,'2025-09-30 11:54:36',1,'2025-10-10 14:19:56',2,NULL,NULL),(28,30,1,'NONE','CR39',1410000.00,10,'2025-09-30 13:17:06',1,NULL,NULL,NULL,NULL),(29,31,1,'NONE','CR39',22222.00,0,'2025-09-30 22:48:54',1,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `lens_variant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_3d_config`
--

DROP TABLE IF EXISTS `model_3d_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model_3d_config` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `model_id` bigint DEFAULT NULL,
  `offset_x` double DEFAULT NULL,
  `offset_y` double DEFAULT NULL,
  `position_offset_x` double DEFAULT NULL,
  `position_offset_y` double DEFAULT NULL,
  `position_offset_z` double DEFAULT NULL,
  `initial_scale` double DEFAULT NULL,
  `rotation_sensitivity` double DEFAULT NULL,
  `yaw_limit` double DEFAULT NULL,
  `pitch_limit` double DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_model_id` (`model_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_3d_config`
--

LOCK TABLES `model_3d_config` WRITE;
/*!40000 ALTER TABLE `model_3d_config` DISABLE KEYS */;
INSERT INTO `model_3d_config` VALUES (1,1,0.5,0.5,0.4,0.1,-0.4,0.16,1,1,0.5,'2025-09-10 15:00:51',1,'2025-09-17 14:55:23',1,NULL,NULL);
/*!40000 ALTER TABLE `model_3d_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `cart_id` bigint DEFAULT NULL,
  `order_date` timestamp NULL DEFAULT NULL,
  `subtotal` double DEFAULT NULL,
  `shipping_cost` double DEFAULT NULL,
  `total_price` double DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `payment_status` varchar(255) DEFAULT NULL,
  `tracking_number` varchar(50) DEFAULT NULL,
  `delivery_date` timestamp NULL DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `province` varchar(100) NOT NULL,
  `district` varchar(100) NOT NULL,
  `ward` varchar(100) NOT NULL,
  `address_detail` varchar(255) NOT NULL,
  `notes` text,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `order_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `order_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `order_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `order_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=181 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES (166,1,'test thanh toan 2',7,'2025-09-30 19:20:02',2000,0,2000,'payos','pending',NULL,NULL,NULL,'pending',NULL,1,NULL,1,NULL,NULL,'0123456789','a@gmail.com','TP. Hồ Chí Minh','Quận 1','Phường Bến Nghé','123',''),(167,1,'huy dz test thanh toan',7,'2025-09-30 19:47:17',2000,0,2000,'payos','completed',NULL,'2025-11-20 08:27:40',NULL,'delivered',NULL,1,'2025-11-20 08:27:40',1,NULL,NULL,'0123456789','huy@gmail.com','TP. Hồ Chí Minh','Quận 1','Phường Bến Nghé','aaa',''),(168,1,'aaa',7,'2025-09-30 21:01:18',2000,0,2000,'payos','completed',NULL,'2025-11-20 08:27:56',NULL,'delivered',NULL,1,'2025-11-20 08:27:55',1,NULL,NULL,'0123456789','giahuy260123@gmail.com','TP. Hồ Chí Minh','Quận 1','Phường Bến Nghé','aaaaaaaaax',''),(169,1,'TEST THANH TOAN',7,'2025-09-30 22:33:10',2000,0,2000,'payos','completed',NULL,NULL,NULL,'processing',NULL,1,'2025-09-30 15:33:10',1,NULL,NULL,'0123456789','huy@gmail.com','TP. Hồ Chí Minh','Quận 1','Phường Bến Nghé','aaaaaaaaaa',''),(170,1,'Test order',7,'2025-10-01 11:41:49',2000,0,2000,'cash','pending',NULL,NULL,NULL,'pending',NULL,1,NULL,1,NULL,NULL,'0123456789','huy@gmail.com','TP. Hồ Chí Minh','Quận 1','Phường Bến Nghé','huy123',NULL),(171,1,'Test order',7,'2025-10-01 11:46:47',2000,0,2000,'cash','completed',NULL,'2025-10-09 13:09:47',NULL,'delivered',NULL,1,'2025-11-20 08:26:34',1,NULL,NULL,'0123456789','huy@gmail.com','TP. Hồ Chí Minh','Quận 1','Phường Bến Nghé','huy123',NULL),(172,1,'Test order 3',7,'2025-10-01 11:52:32',3381000,0,3381000,'cash','completed',NULL,'2025-10-01 11:54:45',NULL,'delivered',NULL,1,'2025-10-01 04:54:45',1,NULL,NULL,'0123456789','huy123@gmail.com','TP. Hồ Chí Minh','Quận 1','Phường Bến Nghé','aaaaaaaa',NULL),(173,1,'Test many item order',7,'2025-10-01 14:42:59',5522000,0,5522000,'cash','completed',NULL,'2025-10-09 13:10:07',NULL,'delivered',NULL,1,'2025-11-20 08:26:48',1,NULL,NULL,'0123456789','a@gmail.com','TP. Hồ Chí Minh','Quận 1','Phường Bến Nghé','a',NULL),(174,1,'Nguyễn Gia Huy',7,'2025-10-01 14:47:20',5522000,0,5522000,'cash','pending',NULL,NULL,NULL,'pending',NULL,1,NULL,1,NULL,NULL,'0349514558','a@gmail.com','TP. Hồ Chí Minh','Quận 1','Phường Bến Nghé','huy@gmail.com',NULL),(175,1,'Test COD rm item from cart',7,'2025-10-01 15:05:00',5522000,0,5522000,'cash','completed',NULL,NULL,NULL,'pending',NULL,1,'2025-10-06 06:48:15',1,NULL,NULL,'0123456789','a@gmail.com','TP. Hồ Chí Minh','Quận 1','Phường Bến Nghé','469 DHQ',NULL),(176,1,'khoa ',7,'2025-10-02 13:16:27',2000,0,2000,'payos','completed',NULL,NULL,NULL,'processing',NULL,1,'2025-10-02 06:16:26',1,NULL,NULL,'0123456789','a@gmail.com','TP. Hồ Chí Minh','Quận 1','Phường Bến Nghé','a',''),(177,2,'huy',9,'2025-10-08 16:09:52',499000,30000,529000,'cash','pending',NULL,NULL,NULL,'pending',NULL,2,NULL,2,NULL,NULL,'01234567891','a@gmail.com','Thành phố Hà Nội','Quận Ba Đình','Phường Phúc Xá','Hong biet nua',NULL),(178,2,'Nguyễn Gia Huy',9,'2025-10-08 21:59:14',499000,30000,529000,'cash','pending',NULL,NULL,NULL,'pending',NULL,2,NULL,2,NULL,NULL,'0349518258','a@gmail.com','Thành phố Hồ Chí Minh','Quận Gò Vấp','Phường 6','496/21 Dương Quảng Hàm',NULL),(179,2,'Nguyễn Gia Bu',9,'2025-10-08 22:06:08',2000,0,2000,'payos','completed',NULL,NULL,NULL,'processing',NULL,2,'2025-10-08 15:06:08',2,NULL,NULL,'0123456789','a@gmail.com','Thành phố Hồ Chí Minh','Quận Gò Vấp','Phường 6','496/21 Dương Quảng Hàm',''),(180,2,'Nguyễn Gia Huy',9,'2025-10-10 21:19:57',2000,0,2000,'payos','completed',NULL,NULL,NULL,'processing',NULL,2,'2025-10-10 14:19:56',2,NULL,NULL,'0123345567','a@gmail.com','Thành phố Hồ Chí Minh','Quận Gò Vấp','Phường 6','496/21 Dương Quảng Hàm','');
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_item`
--

DROP TABLE IF EXISTS `order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_item` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `quantity` int DEFAULT '1',
  `frame_price` decimal(10,2) DEFAULT '0.00',
  `total_price` decimal(10,2) DEFAULT '0.00',
  `discount` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  `selected_color_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_item_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`),
  CONSTRAINT `order_item_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `order_item_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`),
  CONSTRAINT `order_item_ibfk_4` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `order_item_ibfk_5` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`),
  CONSTRAINT `order_item_ibfk_6` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `order_item_ibfk_7` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`),
  CONSTRAINT `order_item_ibfk_8` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=191 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item`
--

LOCK TABLES `order_item` WRITE;
/*!40000 ALTER TABLE `order_item` DISABLE KEYS */;
INSERT INTO `order_item` VALUES (161,166,5,1,2000.00,2000.00,0.00,NULL,1,NULL,1,NULL,NULL,6),(162,167,5,1,2000.00,2000.00,0.00,NULL,1,NULL,1,NULL,NULL,7),(163,168,5,1,2000.00,2000.00,0.00,NULL,1,NULL,1,NULL,NULL,6),(164,169,5,1,2000.00,2000.00,0.00,NULL,1,NULL,1,NULL,NULL,7),(165,170,5,1,2000.00,2000.00,0.00,NULL,1,NULL,1,NULL,NULL,6),(166,171,5,1,2000.00,2000.00,0.00,NULL,1,NULL,1,NULL,NULL,6),(167,172,5,1,2000.00,2000.00,0.00,NULL,1,NULL,1,NULL,NULL,6),(168,173,3,1,560000.00,560000.00,0.00,NULL,1,NULL,1,NULL,NULL,4),(169,173,3,1,560000.00,560000.00,0.00,NULL,1,NULL,1,NULL,NULL,4),(170,173,3,1,560000.00,560000.00,0.00,NULL,1,NULL,1,NULL,NULL,4),(171,173,4,1,459000.00,459000.00,0.00,NULL,1,NULL,1,NULL,NULL,5),(172,173,5,1,2000.00,2000.00,0.00,NULL,1,NULL,1,NULL,NULL,6),(173,173,5,1,2000.00,2000.00,0.00,NULL,1,NULL,1,NULL,NULL,6),(174,174,3,1,560000.00,560000.00,0.00,NULL,1,NULL,1,NULL,NULL,4),(175,174,3,1,560000.00,560000.00,0.00,NULL,1,NULL,1,NULL,NULL,4),(176,174,3,1,560000.00,560000.00,0.00,NULL,1,NULL,1,NULL,NULL,4),(177,174,4,1,459000.00,459000.00,0.00,NULL,1,NULL,1,NULL,NULL,5),(178,174,5,1,2000.00,2000.00,0.00,NULL,1,NULL,1,NULL,NULL,6),(179,174,5,1,2000.00,2000.00,0.00,NULL,1,NULL,1,NULL,NULL,6),(180,175,3,1,560000.00,560000.00,0.00,NULL,1,NULL,1,NULL,NULL,4),(181,175,3,1,560000.00,560000.00,0.00,NULL,1,NULL,1,NULL,NULL,4),(182,175,3,1,560000.00,560000.00,0.00,NULL,1,NULL,1,NULL,NULL,4),(183,175,4,1,459000.00,459000.00,0.00,NULL,1,NULL,1,NULL,NULL,5),(184,175,5,1,2000.00,2000.00,0.00,NULL,1,NULL,1,NULL,NULL,6),(185,175,5,1,2000.00,2000.00,0.00,NULL,1,NULL,1,NULL,NULL,6),(186,176,5,1,2000.00,2000.00,0.00,NULL,1,NULL,1,NULL,NULL,6),(187,177,9,1,499000.00,499000.00,0.00,NULL,2,NULL,2,NULL,NULL,14),(188,178,9,1,499000.00,499000.00,0.00,NULL,2,NULL,2,NULL,NULL,14),(189,179,5,1,2000.00,2000.00,0.00,NULL,2,NULL,2,NULL,NULL,6),(190,180,5,1,2000.00,2000.00,0.00,NULL,2,NULL,2,NULL,NULL,6);
/*!40000 ALTER TABLE `order_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_lens_detail`
--

DROP TABLE IF EXISTS `order_lens_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_lens_detail` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_item_id` bigint NOT NULL,
  `lens_id` bigint DEFAULT NULL,
  `right_eye_sphere` decimal(4,2) DEFAULT NULL,
  `right_eye_cylinder` decimal(4,2) DEFAULT NULL,
  `right_eye_axis` int DEFAULT NULL,
  `left_eye_sphere` decimal(4,2) DEFAULT NULL,
  `left_eye_cylinder` decimal(4,2) DEFAULT NULL,
  `left_eye_axis` int DEFAULT NULL,
  `pd_left` decimal(4,1) DEFAULT NULL,
  `pd_right` decimal(4,1) DEFAULT NULL,
  `lens_type` varchar(100) DEFAULT NULL,
  `lens_thickness_id` bigint DEFAULT NULL,
  `lens_price` decimal(10,2) DEFAULT '0.00',
  `lens_material` varchar(50) DEFAULT NULL,
  `tint_id` bigint DEFAULT NULL,
  `prescription_notes` text,
  `lens_notes` text,
  `add_left` decimal(4,2) DEFAULT NULL,
  `add_right` decimal(4,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  `lens_variant_id` bigint DEFAULT NULL,
  `selected_coating_ids` text,
  `selected_tint_color_id` bigint DEFAULT NULL,
  `manufacturing_notes` text,
  PRIMARY KEY (`id`),
  KEY `order_item_id` (`order_item_id`),
  KEY `lens_id` (`lens_id`),
  KEY `lens_thickness_id` (`lens_thickness_id`),
  KEY `tint_id` (`tint_id`),
  CONSTRAINT `order_lens_detail_ibfk_1` FOREIGN KEY (`order_item_id`) REFERENCES `order_item` (`id`),
  CONSTRAINT `order_lens_detail_ibfk_2` FOREIGN KEY (`order_item_id`) REFERENCES `order_item` (`id`),
  CONSTRAINT `order_lens_detail_ibfk_3` FOREIGN KEY (`order_item_id`) REFERENCES `order_item` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_lens_detail`
--

LOCK TABLES `order_lens_detail` WRITE;
/*!40000 ALTER TABLE `order_lens_detail` DISABLE KEYS */;
INSERT INTO `order_lens_detail` VALUES (8,161,NULL,0.00,0.00,0,0.00,0.00,0,31.5,31.5,NULL,NULL,0.00,NULL,NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',0.00,0.00,NULL,1,NULL,1,NULL,NULL,27,NULL,NULL,NULL),(9,162,NULL,2.25,0.00,0,0.50,0.00,0,31.5,31.5,NULL,NULL,0.00,NULL,NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',2.00,2.25,NULL,1,NULL,1,NULL,NULL,27,NULL,NULL,NULL),(10,163,NULL,0.00,0.00,0,0.00,0.00,0,31.5,31.5,NULL,NULL,0.00,NULL,NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',0.00,0.00,NULL,1,NULL,1,NULL,NULL,27,NULL,NULL,NULL),(11,164,NULL,0.00,0.00,0,0.00,0.00,0,31.5,31.5,NULL,NULL,0.00,NULL,NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',0.00,0.00,NULL,1,NULL,1,NULL,NULL,27,NULL,NULL,NULL),(12,166,NULL,0.00,0.00,0,0.00,0.00,0,31.5,31.5,NULL,NULL,0.00,NULL,NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',0.00,0.00,NULL,1,NULL,1,NULL,NULL,25,'[11]',NULL,NULL),(13,167,NULL,0.00,0.00,0,0.00,0.00,0,31.5,31.5,NULL,NULL,3379000.00,NULL,NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',0.00,0.00,NULL,1,NULL,1,NULL,NULL,26,'[11]',NULL,NULL),(14,173,NULL,0.00,0.00,0,0.00,0.00,0,31.5,31.5,NULL,NULL,3379000.00,NULL,NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',0.00,0.00,NULL,1,NULL,1,NULL,NULL,26,'[11]',NULL,NULL),(15,179,NULL,0.00,0.00,0,0.00,0.00,0,31.5,31.5,NULL,NULL,3379000.00,NULL,NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',0.00,0.00,NULL,1,NULL,1,NULL,NULL,26,'[11]',NULL,NULL),(16,185,NULL,0.00,0.00,0,0.00,0.00,0,31.5,31.5,NULL,NULL,3379000.00,NULL,NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',0.00,0.00,NULL,1,NULL,1,NULL,NULL,26,'[11]',NULL,NULL),(17,186,NULL,0.00,0.00,0,0.00,0.00,0,31.5,31.5,NULL,NULL,0.00,NULL,NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',0.00,0.00,NULL,1,NULL,1,NULL,NULL,27,'[11]',NULL,NULL),(18,189,NULL,0.00,0.00,0,0.00,0.00,0,31.5,31.5,NULL,NULL,0.00,NULL,NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',0.00,0.00,NULL,2,NULL,2,NULL,NULL,27,'[11]',NULL,NULL),(19,190,NULL,0.00,0.00,0,0.00,0.00,0,31.5,31.5,NULL,NULL,0.00,NULL,NULL,'Từ trang Lens Selection','Loại tròng: SINGLE_VISION',0.00,0.00,NULL,2,NULL,2,NULL,NULL,27,'[11]',NULL,NULL);
/*!40000 ALTER TABLE `order_lens_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`),
  CONSTRAINT `payment_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`),
  CONSTRAINT `payment_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`),
  CONSTRAINT `payment_ibfk_4` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=427 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (17,166,'payos',2000.00,'completed','1759234769812',NULL,1,'2025-09-30 12:20:01',1,NULL,NULL),(413,167,'payos',2000.00,'completed','1759236390473',NULL,1,'2025-09-30 12:47:16',1,NULL,NULL),(418,168,'payos',2000.00,'completed','1759240837336',NULL,1,'2025-09-30 14:01:17',1,NULL,NULL),(419,169,'payos',2000.00,'completed','1759246360761',NULL,1,'2025-09-30 15:33:10',1,NULL,NULL),(420,NULL,'payos',2000.00,'pending','1759385523830',NULL,1,NULL,1,NULL,NULL),(421,176,'payos',2000.00,'completed','1759385742958',NULL,1,'2025-10-02 06:16:26',1,NULL,NULL),(422,NULL,'payos',2000.00,'pending','1759420588078',NULL,1,NULL,1,NULL,NULL),(423,NULL,'payos',2000.00,'pending','1759935731003',NULL,2,NULL,2,NULL,NULL),(424,NULL,'payos',2000.00,'pending','1759935906023',NULL,2,NULL,2,NULL,NULL),(425,179,'payos',2000.00,'completed','1759935945781',NULL,2,'2025-10-08 15:06:08',2,NULL,NULL),(426,180,'payos',2000.00,'completed','1760105964954',NULL,2,'2025-10-10 14:19:56',2,NULL,NULL);
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescription_values`
--

DROP TABLE IF EXISTS `prescription_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescription_values` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `order_id` bigint DEFAULT NULL,
  `sphere_right` decimal(4,2) DEFAULT NULL,
  `cylinder_right` decimal(4,2) DEFAULT NULL,
  `axis_right` int DEFAULT NULL,
  `add_right` decimal(4,2) DEFAULT NULL,
  `sphere_left` decimal(4,2) DEFAULT NULL,
  `cylinder_left` decimal(4,2) DEFAULT NULL,
  `axis_left` int DEFAULT NULL,
  `add_left` decimal(4,2) DEFAULT NULL,
  `pupillary_distance` decimal(4,2) DEFAULT NULL,
  `pd_right` decimal(4,2) DEFAULT NULL,
  `pd_left` decimal(4,2) DEFAULT NULL,
  `prescription_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_prescription_date` (`prescription_date`),
  CONSTRAINT `prescription_values_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL,
  CONSTRAINT `prescription_values_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE SET NULL,
  CONSTRAINT `prescription_values_chk_1` CHECK (((`axis_right` >= 0) and (`axis_right` <= 180))),
  CONSTRAINT `prescription_values_chk_2` CHECK (((`axis_left` >= 0) and (`axis_left` <= 180)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescription_values`
--

LOCK TABLES `prescription_values` WRITE;
/*!40000 ALTER TABLE `prescription_values` DISABLE KEYS */;
/*!40000 ALTER TABLE `prescription_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) DEFAULT NULL,
  `product_type` varchar(255) DEFAULT NULL,
  `brand_id` bigint DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_sustainable` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  `is_new` tinyint(1) DEFAULT NULL,
  `new_until` timestamp NULL DEFAULT NULL,
  `is_boutique` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `brand_id` (`brand_id`),
  CONSTRAINT `product_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`),
  CONSTRAINT `product_ibfk_2` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`),
  CONSTRAINT `product_ibfk_3` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`),
  CONSTRAINT `product_ibfk_4` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'RX 7074','glasses',1,'unisex',899000,'Ray-Ban RX 7074',1,'2025-08-11 04:04:29',1,'2025-10-08 00:00:00',1,NULL,NULL,0,'2025-10-03 22:56:00',1),(2,'Glasses Test','glasses',2,'unisex',120000,'Glasses Test',1,'2025-08-12 03:43:35',1,'2025-08-12 03:43:35',1,NULL,NULL,0,NULL,1),(3,'DB 1106','glasses',11,'unisex',560000,'DB 1106',1,'2025-08-12 04:32:46',1,'2025-10-08 00:00:00',1,NULL,NULL,0,'2025-10-03 23:16:00',1),(4,'FT 5313/V','glasses',21,'male',459000,'FT 5313/V',0,'2025-08-14 02:34:28',1,'2025-09-28 00:00:00',1,NULL,NULL,0,'2025-09-13 02:34:28',1),(5,'RX 7211','glasses',1,'unisex',2000,'RX 7211 Glasses',0,'2025-09-29 11:43:40',1,'2025-09-29 11:43:40',1,NULL,NULL,1,'2025-10-29 11:43:40',0),(6,'GG 0746S','sunglasses',2,'male',999000,'Sunglasses GG 0746S',0,'2025-10-01 14:03:34',1,'2025-10-01 14:03:34',1,NULL,NULL,1,'2025-10-31 14:03:34',0),(7,'RX 2242V','glasses',1,'female',490000,'Ray Ban RX 2242V',0,'2025-10-03 18:52:52',1,'2025-10-03 18:57:27',1,NULL,NULL,0,NULL,0),(8,'FT 5973-B','glasses',21,'male',599000,'FT 5973-B Tom Ford Glasses',0,'2025-10-03 19:16:52',1,'2025-10-03 19:16:52',1,NULL,NULL,1,'2025-11-02 19:16:52',0),(9,'GG1703O','glasses',2,'unisex',499000,'Gucci GG1703O',0,'2025-10-06 14:02:08',1,'2025-10-06 14:17:50',1,NULL,NULL,1,'2025-11-05 14:17:50',1);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_3d_model`
--

DROP TABLE IF EXISTS `product_3d_model`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_3d_model` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint DEFAULT NULL,
  `model_name` varchar(255) DEFAULT NULL,
  `model_file_path` varchar(255) DEFAULT NULL,
  `model_type` varchar(255) DEFAULT NULL,
  `mtl_file_path` varchar(255) DEFAULT NULL,
  `texture_base_path` varchar(255) DEFAULT NULL,
  `config_json` text,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_3d_model`
--

LOCK TABLES `product_3d_model` WRITE;
/*!40000 ALTER TABLE `product_3d_model` DISABLE KEYS */;
INSERT INTO `product_3d_model` VALUES (1,1,'RX 7074 - 3D Model','https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product-1-3d-models/1757476998526-Untitled.glb','GLB','','https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product-1-3d-models/1757476925186-texture_diffuse.png','{\"textureDiffusePath\":\"https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product-1-3d-models/1757476925186-texture_diffuse.png\",\"textureNormalPath\":\"https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product-1-3d-models/1757476930339-texture_normal.png\",\"textureMetallicPath\":\"https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product-1-3d-models/1757476934075-texture_metallic.png\",\"textureRoughnessPath\":\"https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product-1-3d-models/1757476935928-texture_roughness.png\",\"texturePbrPath\":\"https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product-1-3d-models/1757476937377-texture_pbr.png\",\"description\":\"\",\"version\":\"1.0\"}',1,'2025-09-10 11:03:27',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `product_3d_model` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_bestseller`
--

DROP TABLE IF EXISTS `product_bestseller`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_bestseller` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint NOT NULL,
  `is_pinned` tinyint(1) NOT NULL DEFAULT '0',
  `custom_priority` int DEFAULT NULL,
  `display_order` int DEFAULT NULL,
  `total_sales` int NOT NULL DEFAULT '0',
  `sales_last_30_days` int NOT NULL DEFAULT '0',
  `revenue_generated` decimal(15,2) NOT NULL DEFAULT '0.00',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `notes` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_product_bestseller_product_id` (`product_id`),
  KEY `idx_product_bestseller_active` (`is_active`,`is_pinned`),
  CONSTRAINT `fk_product_bestseller_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_bestseller`
--

LOCK TABLES `product_bestseller` WRITE;
/*!40000 ALTER TABLE `product_bestseller` DISABLE KEYS */;
INSERT INTO `product_bestseller` VALUES (1,9,1,1,NULL,0,0,0.00,1,NULL,'2025-11-20 07:58:09',1,'2025-11-20 08:28:26',1),(2,8,0,NULL,NULL,0,0,0.00,1,NULL,'2025-11-20 08:05:18',1,'2025-11-20 08:28:25',1);
/*!40000 ALTER TABLE `product_bestseller` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_category`
--

DROP TABLE IF EXISTS `product_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `product_category_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `product_category_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  CONSTRAINT `product_category_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `product_category_ibfk_4` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  CONSTRAINT `product_category_ibfk_5` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `product_category_ibfk_6` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  CONSTRAINT `product_category_ibfk_7` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `product_category_ibfk_8` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_category`
--

LOCK TABLES `product_category` WRITE;
/*!40000 ALTER TABLE `product_category` DISABLE KEYS */;
INSERT INTO `product_category` VALUES (1,1,1,'2025-08-11 04:04:29',1,NULL,NULL,'2025-08-11 04:09:09',1),(2,1,2,'2025-08-11 04:04:29',1,NULL,NULL,'2025-08-11 04:09:09',1),(3,1,1,'2025-08-11 04:09:09',1,NULL,NULL,'2025-08-11 04:17:04',1),(4,1,2,'2025-08-11 04:09:09',1,NULL,NULL,'2025-08-11 04:17:04',1),(5,1,1,'2025-08-11 04:17:04',1,NULL,NULL,'2025-08-11 04:19:35',1),(6,1,2,'2025-08-11 04:17:04',1,NULL,NULL,'2025-08-11 04:19:35',1),(7,1,1,'2025-08-11 04:19:35',1,NULL,NULL,'2025-08-11 04:39:59',1),(8,1,2,'2025-08-11 04:19:35',1,NULL,NULL,'2025-08-11 04:39:59',1),(9,1,1,'2025-08-11 04:39:59',1,NULL,NULL,'2025-08-11 04:40:26',1),(10,1,2,'2025-08-11 04:39:59',1,NULL,NULL,'2025-08-11 04:40:26',1),(11,1,1,'2025-08-11 04:40:26',1,NULL,NULL,'2025-08-11 04:41:15',1),(12,1,2,'2025-08-11 04:40:26',1,NULL,NULL,'2025-08-11 04:41:15',1),(13,1,1,'2025-08-11 04:41:15',1,NULL,NULL,'2025-08-11 04:41:30',1),(14,1,2,'2025-08-11 04:41:15',1,NULL,NULL,'2025-08-11 04:41:30',1),(15,1,1,'2025-08-11 04:41:30',1,NULL,NULL,'2025-08-11 04:48:43',1),(16,1,2,'2025-08-11 04:41:30',1,NULL,NULL,'2025-08-11 04:48:43',1),(17,1,1,'2025-08-11 04:48:43',1,NULL,NULL,'2025-08-11 09:41:19',1),(18,1,2,'2025-08-11 04:48:43',1,NULL,NULL,'2025-08-11 09:41:19',1),(19,1,1,'2025-08-11 09:41:19',1,NULL,NULL,'2025-09-03 10:34:14',1),(20,1,2,'2025-08-11 09:41:20',1,NULL,NULL,'2025-09-03 10:34:14',1),(21,2,1,'2025-08-12 03:43:35',1,NULL,NULL,NULL,NULL),(22,2,2,'2025-08-12 03:43:35',1,NULL,NULL,NULL,NULL),(23,2,3,'2025-08-12 03:43:35',1,NULL,NULL,NULL,NULL),(24,3,1,'2025-08-12 04:32:46',1,NULL,NULL,'2025-09-03 23:16:00',1),(25,3,2,'2025-08-12 04:32:46',1,NULL,NULL,'2025-09-03 23:16:00',1),(26,4,1,'2025-08-14 02:34:28',1,NULL,NULL,NULL,NULL),(27,1,1,'2025-09-03 10:34:14',1,NULL,NULL,'2025-09-03 10:34:20',1),(28,1,2,'2025-09-03 10:34:14',1,NULL,NULL,'2025-09-03 10:34:20',1),(29,1,1,'2025-09-03 10:34:20',1,NULL,NULL,'2025-09-03 22:56:00',1),(30,1,2,'2025-09-03 10:34:20',1,NULL,NULL,'2025-09-03 22:56:00',1),(31,1,1,'2025-09-03 22:56:00',1,NULL,NULL,NULL,NULL),(32,1,2,'2025-09-03 22:56:00',1,NULL,NULL,NULL,NULL),(33,3,1,'2025-09-03 23:16:00',1,NULL,NULL,NULL,NULL),(34,3,2,'2025-09-03 23:16:00',1,NULL,NULL,NULL,NULL),(35,5,1,'2025-09-29 11:43:40',1,NULL,NULL,NULL,NULL),(36,5,4,'2025-09-29 11:43:40',1,NULL,NULL,NULL,NULL),(37,6,5,'2025-10-01 14:03:34',1,NULL,NULL,NULL,NULL),(38,7,2,'2025-10-03 18:52:52',1,NULL,NULL,'2025-10-03 18:55:56',1),(39,7,4,'2025-10-03 18:52:52',1,NULL,NULL,'2025-10-03 18:55:56',1),(40,7,2,'2025-10-03 18:55:56',1,NULL,NULL,'2025-10-03 18:57:27',1),(41,7,4,'2025-10-03 18:55:56',1,NULL,NULL,'2025-10-03 18:57:27',1),(42,7,2,'2025-10-03 18:57:27',1,NULL,NULL,NULL,NULL),(43,7,4,'2025-10-03 18:57:27',1,NULL,NULL,NULL,NULL),(44,8,1,'2025-10-03 19:16:52',1,NULL,NULL,NULL,NULL),(45,8,4,'2025-10-03 19:16:52',1,NULL,NULL,NULL,NULL),(46,9,1,'2025-10-06 14:02:08',1,NULL,NULL,'2025-10-06 14:17:50',1),(47,9,2,'2025-10-06 14:02:08',1,NULL,NULL,'2025-10-06 14:17:50',1),(48,9,4,'2025-10-06 14:02:08',1,NULL,NULL,'2025-10-06 14:17:50',1),(49,9,1,'2025-10-06 14:17:50',1,NULL,NULL,NULL,NULL),(50,9,2,'2025-10-06 14:17:50',1,NULL,NULL,NULL,NULL),(51,9,4,'2025-10-06 14:17:51',1,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `product_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_color`
--

DROP TABLE IF EXISTS `product_color`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_color` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint DEFAULT NULL,
  `product_variant_name` varchar(255) DEFAULT NULL,
  `product_number` int DEFAULT NULL,
  `color_name` varchar(255) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `is_thumbnail` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_color_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `product_color_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `product_color_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `product_color_ibfk_4` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_color`
--

LOCK TABLES `product_color` WRITE;
/*!40000 ALTER TABLE `product_color` DISABLE KEYS */;
INSERT INTO `product_color` VALUES (2,1,'5364',6661248,'Black',10,1,'2025-08-11 04:08:51',1,NULL,NULL,NULL,NULL),(3,2,'AAA',11111,'AAA',20,1,'2025-08-12 03:43:35',1,'2025-10-09 14:43:19',1,NULL,NULL),(4,3,'1ED',7673795,'Green / Transparent',13,1,'2025-08-12 04:32:46',1,'2025-10-09 06:10:06',1,NULL,NULL),(5,4,'002',6514022,'Black',11,1,'2025-08-14 02:34:28',1,'2025-10-09 06:10:06',1,NULL,NULL),(6,5,'8206',6858284,'Grey',10,1,'2025-09-29 11:43:40',1,'2025-10-10 14:19:56',2,NULL,NULL),(7,5,'8205',6858283,'Blue',10,0,'2025-09-29 11:43:42',1,NULL,NULL,NULL,NULL),(8,6,'001',6772504,'Black',10,1,'2025-10-01 14:03:34',1,NULL,NULL,NULL,NULL),(9,6,'003',6772505,'Havana',10,0,'2025-10-01 14:03:37',1,NULL,NULL,NULL,NULL),(10,7,'8292',7865928,'Purple / Transparent',10,1,'2025-10-03 18:52:52',1,NULL,NULL,NULL,NULL),(11,7,'8291',7789273,'Grey / Transparent',10,0,'2025-10-03 18:52:55',1,NULL,NULL,NULL,NULL),(12,8,'020',7243798,'Black / Grey',5,1,'2025-10-03 19:16:53',1,NULL,NULL,NULL,NULL),(13,8,'050',7650562,'Brown / Gold',5,0,'2025-10-03 19:16:54',1,NULL,NULL,NULL,NULL),(14,9,'003',7026448,'Grey',9,1,'2025-10-06 14:02:08',1,'2025-10-08 14:59:13',2,NULL,NULL),(15,9,'001',7535091,'Gold',0,0,'2025-10-06 14:02:10',1,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `product_color` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_detail`
--

DROP TABLE IF EXISTS `product_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_detail` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint DEFAULT NULL,
  `bridge_width` double DEFAULT NULL,
  `frame_width` double DEFAULT NULL,
  `lens_height` double DEFAULT NULL,
  `lens_width` double DEFAULT NULL,
  `temple_length` double DEFAULT NULL,
  `product_number` int DEFAULT NULL,
  `frame_colour` varchar(255) DEFAULT NULL,
  `frame_material` varchar(255) DEFAULT NULL,
  `frame_shape` varchar(255) DEFAULT NULL,
  `frame_type` varchar(255) DEFAULT NULL,
  `bridge_design` varchar(255) DEFAULT NULL,
  `style` varchar(255) DEFAULT NULL,
  `spring_hinges` tinyint(1) DEFAULT NULL,
  `weight` double DEFAULT NULL,
  `multifocal` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_detail_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `product_detail_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `product_detail_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `product_detail_ibfk_4` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_detail`
--

LOCK TABLES `product_detail` WRITE;
/*!40000 ALTER TABLE `product_detail` DISABLE KEYS */;
INSERT INTO `product_detail` VALUES (1,1,18,134,39,50,145,NULL,NULL,'plastic','square','full_rim','without_nose_pads','modern',0,20,1,'2025-08-11 04:04:29',1,'2025-09-03 22:56:00',1,NULL,NULL),(2,2,1,1,1,1,1,NULL,NULL,'plastic','round','full_rim','without_nose_pads','classic',1,1,0,'2025-08-12 03:43:35',1,NULL,NULL,NULL,NULL),(3,3,19,136,43,50,150,NULL,NULL,'plastic','round','full_rim','without_nose_pads','modern',1,27,1,'2025-08-12 04:32:46',1,'2025-09-03 23:16:00',1,NULL,NULL),(4,4,17,136,38,55,145,NULL,NULL,'plastic','rectangle','full_rim','without_nose_pads','classic',1,34,1,'2025-08-14 02:34:28',1,NULL,NULL,NULL,NULL),(5,5,19,140,41,52,145,NULL,NULL,'plastic','square','full_rim','without_nose_pads','modern',0,25,1,'2025-09-29 11:43:40',1,NULL,NULL,NULL,NULL),(6,5,19,140,41,52,145,NULL,NULL,'plastic','square','full_rim','without_nose_pads','modern',0,25,1,'2025-09-29 11:43:42',1,NULL,NULL,NULL,NULL),(7,6,17,143,45,57,145,NULL,NULL,'plastic','square','full_rim','without_nose_pads','classic',0,35,1,'2025-10-01 14:03:34',1,NULL,NULL,NULL,NULL),(8,6,17,143,45,57,145,NULL,NULL,'plastic','square','full_rim','without_nose_pads','classic',0,35,1,'2025-10-01 14:03:37',1,NULL,NULL,NULL,NULL),(9,7,22,142,36,50,150,NULL,NULL,'plastic','oval','full_rim','without_nose_pads','classic',0,36,1,'2025-10-03 18:52:52',1,'2025-10-03 18:57:27',1,NULL,NULL),(10,7,22,142,36,50,150,NULL,NULL,'plastic','oval','full_rim','without_nose_pads','classic',0,36,1,'2025-10-03 18:52:55',1,NULL,NULL,NULL,NULL),(11,8,20,135,39,39,49,NULL,NULL,'metal','oval','full_rim','with_nose_pads','classic',0,25,1,'2025-10-03 19:16:53',1,NULL,NULL,NULL,NULL),(12,8,20,135,39,39,49,NULL,NULL,'metal','oval','full_rim','with_nose_pads','classic',0,25,1,'2025-10-03 19:16:54',1,NULL,NULL,NULL,NULL),(13,9,17,139,38,55,140,NULL,NULL,'metal','rectangle','rimless','with_nose_pads','extravagant',0,27,1,'2025-10-06 14:02:08',1,'2025-10-06 14:17:51',1,NULL,NULL),(14,9,17,139,38,55,140,NULL,NULL,'metal','rectangle','rimless','with_nose_pads','extravagant',0,27,1,'2025-10-06 14:02:10',1,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `product_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_face_shape`
--

DROP TABLE IF EXISTS `product_face_shape`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_face_shape` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `face_shape_id` bigint DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `face_shape_id` (`face_shape_id`),
  CONSTRAINT `product_face_shape_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `product_face_shape_ibfk_2` FOREIGN KEY (`face_shape_id`) REFERENCES `face_shape` (`id`),
  CONSTRAINT `product_face_shape_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `product_face_shape_ibfk_4` FOREIGN KEY (`face_shape_id`) REFERENCES `face_shape` (`id`),
  CONSTRAINT `product_face_shape_ibfk_5` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `product_face_shape_ibfk_6` FOREIGN KEY (`face_shape_id`) REFERENCES `face_shape` (`id`),
  CONSTRAINT `product_face_shape_ibfk_7` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `product_face_shape_ibfk_8` FOREIGN KEY (`face_shape_id`) REFERENCES `face_shape` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_face_shape`
--

LOCK TABLES `product_face_shape` WRITE;
/*!40000 ALTER TABLE `product_face_shape` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_face_shape` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_image`
--

DROP TABLE IF EXISTS `product_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_image` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  `product_color_id` bigint DEFAULT NULL,
  `image_order` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `product_color_id` (`product_color_id`),
  CONSTRAINT `product_image_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `product_image_ibfk_2` FOREIGN KEY (`product_color_id`) REFERENCES `product_color` (`id`),
  CONSTRAINT `product_image_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `product_image_ibfk_4` FOREIGN KEY (`product_color_id`) REFERENCES `product_color` (`id`),
  CONSTRAINT `product_image_ibfk_5` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `product_image_ibfk_6` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `product_image_ibfk_7` FOREIGN KEY (`product_color_id`) REFERENCES `product_color` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_image`
--

LOCK TABLES `product_image` WRITE;
/*!40000 ALTER TABLE `product_image` DISABLE KEYS */;
INSERT INTO `product_image` VALUES (1,1,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/1-2_rx-7074/1-2_a.png','2025-08-11 04:08:52',1,'2025-08-11 04:19:37',1,'2025-08-11 04:39:32',1,2,'a'),(2,1,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/6661248_rx-7074/6661248_b.png','2025-08-11 04:08:52',1,NULL,NULL,NULL,NULL,2,'b'),(3,1,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/6661248_rx-7074/6661248_c.png','2025-08-11 04:08:52',1,NULL,NULL,NULL,NULL,2,'c'),(4,1,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/6661248_rx-7074/6661248_d.png','2025-08-11 04:08:53',1,NULL,NULL,NULL,NULL,2,'d'),(5,1,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/6661248_rx-7074/6661248_e.png','2025-08-11 04:08:53',1,NULL,NULL,NULL,NULL,2,'e'),(6,1,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/1-2_rx-7074/1-2_a.png','2025-08-11 04:40:00',1,NULL,NULL,'2025-08-11 04:40:24',1,2,'a'),(7,1,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/1-2_rx-7074/1-2_a.png','2025-08-11 04:48:44',1,NULL,NULL,NULL,NULL,2,'a'),(8,2,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/11111_glasses-test/11111_a.png','2025-08-12 03:43:36',1,NULL,NULL,NULL,NULL,3,'a'),(9,3,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7673795_db-1106/7673795_a.png','2025-08-12 04:32:47',1,NULL,NULL,NULL,NULL,4,'a'),(10,3,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7673795_db-1106/7673795_b.png','2025-08-12 04:32:47',1,NULL,NULL,NULL,NULL,4,'b'),(11,3,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7673795_db-1106/7673795_c.png','2025-08-12 04:32:48',1,NULL,NULL,NULL,NULL,4,'c'),(12,3,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7673795_db-1106/7673795_d.png','2025-08-12 04:32:48',1,NULL,NULL,NULL,NULL,4,'d'),(13,4,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/6514022_ft-5313v/6514022_a.png','2025-08-14 02:34:28',1,NULL,NULL,NULL,NULL,5,'a'),(14,4,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/6514022_ft-5313v/6514022_b.png','2025-08-14 02:34:29',1,NULL,NULL,NULL,NULL,5,'b'),(15,4,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/6514022_ft-5313v/6514022_c.png','2025-08-14 02:34:29',1,NULL,NULL,NULL,NULL,5,'c'),(16,4,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/6514022_ft-5313v/6514022_d.png','2025-08-14 02:34:30',1,NULL,NULL,NULL,NULL,5,'d'),(17,5,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/6858284_rx-7211/6858284_a.png','2025-09-29 11:43:41',1,NULL,NULL,NULL,NULL,6,'a'),(18,5,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/6858284_rx-7211/6858284_b.png','2025-09-29 11:43:41',1,NULL,NULL,NULL,NULL,6,'b'),(19,5,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/6858284_rx-7211/6858284_c.png','2025-09-29 11:43:41',1,NULL,NULL,NULL,NULL,6,'c'),(20,5,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/6858284_rx-7211/6858284_d.png','2025-09-29 11:43:42',1,NULL,NULL,NULL,NULL,6,'d'),(21,5,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/6858283_rx-7211/6858283_a.png','2025-09-29 11:43:42',1,NULL,NULL,NULL,NULL,7,'a'),(22,5,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/6858283_rx-7211/6858283_b.png','2025-09-29 11:43:43',1,NULL,NULL,NULL,NULL,7,'b'),(23,5,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/6858283_rx-7211/6858283_c.png','2025-09-29 11:43:43',1,NULL,NULL,NULL,NULL,7,'c'),(24,6,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/6772504_gg-0746s/6772504_a.png','2025-10-01 14:03:35',1,NULL,NULL,NULL,NULL,8,'a'),(25,6,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/6772504_gg-0746s/6772504_b.png','2025-10-01 14:03:35',1,NULL,NULL,NULL,NULL,8,'b'),(26,6,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/6772504_gg-0746s/6772504_c.png','2025-10-01 14:03:36',1,NULL,NULL,NULL,NULL,8,'c'),(27,6,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/6772504_gg-0746s/6772504_d.png','2025-10-01 14:03:36',1,NULL,NULL,NULL,NULL,8,'d'),(28,6,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/6772504_gg-0746s/6772504_e.png','2025-10-01 14:03:37',1,NULL,NULL,NULL,NULL,8,'e'),(29,6,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/6772505_gg-0746s/6772505_a.png','2025-10-01 14:03:37',1,NULL,NULL,NULL,NULL,9,'a'),(30,6,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/6772505_gg-0746s/6772505_b.png','2025-10-01 14:03:37',1,NULL,NULL,NULL,NULL,9,'b'),(31,6,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/6772505_gg-0746s/6772505_c.png','2025-10-01 14:03:38',1,NULL,NULL,NULL,NULL,9,'c'),(32,6,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/6772505_gg-0746s/6772505_d.png','2025-10-01 14:03:38',1,NULL,NULL,NULL,NULL,9,'d'),(33,7,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7865928_rx-2242v/7865928_a.png','2025-10-03 18:52:52',1,NULL,NULL,'2025-10-03 18:55:48',1,10,'a'),(34,7,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7865928_rx-2242v/7865928_b.png','2025-10-03 18:52:53',1,NULL,NULL,'2025-10-03 18:55:53',1,10,'b'),(35,7,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7865928_rx-2242v/7865928_c.png','2025-10-03 18:52:54',1,NULL,NULL,'2025-10-03 18:55:52',1,10,'c'),(36,7,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7865928_rx-2242v/7865928_d.png','2025-10-03 18:52:55',1,NULL,NULL,'2025-10-03 18:55:52',1,10,'d'),(37,7,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7789273_rx-2242v/7789273_a.png','2025-10-03 18:52:55',1,NULL,NULL,NULL,NULL,11,'a'),(38,7,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7789273_rx-2242v/7789273_b.png','2025-10-03 18:52:56',1,NULL,NULL,NULL,NULL,11,'b'),(39,7,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7789273_rx-2242v/7789273_c.png','2025-10-03 18:52:57',1,NULL,NULL,NULL,NULL,11,'c'),(40,7,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7789273_rx-2242v/7789273_d.png','2025-10-03 18:52:57',1,NULL,NULL,NULL,NULL,11,'d'),(41,7,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7-10_rx-2242v/7-10_a.png','2025-10-03 18:57:30',1,NULL,NULL,NULL,NULL,10,'a'),(42,7,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7-10_rx-2242v/7-10_b.png','2025-10-03 18:57:32',1,NULL,NULL,NULL,NULL,10,'b'),(43,7,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7-10_rx-2242v/7-10_c.png','2025-10-03 18:57:33',1,NULL,NULL,NULL,NULL,10,'c'),(44,7,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7-10_rx-2242v/7-10_d.png','2025-10-03 18:57:35',1,NULL,NULL,NULL,NULL,10,'d'),(45,8,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7243798_ft-5973-b/7243798_a.png','2025-10-03 19:16:53',1,NULL,NULL,NULL,NULL,12,'a'),(46,8,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7243798_ft-5973-b/7243798_b.png','2025-10-03 19:16:54',1,NULL,NULL,NULL,NULL,12,'b'),(47,8,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7243798_ft-5973-b/7243798_c.png','2025-10-03 19:16:54',1,NULL,NULL,NULL,NULL,12,'c'),(48,8,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7243798_ft-5973-b/7243798_d.png','2025-10-03 19:16:54',1,NULL,NULL,NULL,NULL,12,'d'),(49,8,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7650562_ft-5973-b/7650562_a.png','2025-10-03 19:16:55',1,NULL,NULL,NULL,NULL,13,'a'),(50,8,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7650562_ft-5973-b/7650562_b.png','2025-10-03 19:16:55',1,NULL,NULL,NULL,NULL,13,'b'),(51,8,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7650562_ft-5973-b/7650562_c.png','2025-10-03 19:16:56',1,NULL,NULL,NULL,NULL,13,'c'),(52,8,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7650562_ft-5973-b/7650562_d.png','2025-10-03 19:16:56',1,NULL,NULL,NULL,NULL,13,'d'),(53,9,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7026448_gg1703o/7026448_a.png','2025-10-06 14:02:09',1,NULL,NULL,NULL,NULL,14,'a'),(54,9,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7026448_gg1703o/7026448_b.png','2025-10-06 14:02:09',1,NULL,NULL,NULL,NULL,14,'b'),(55,9,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7026448_gg1703o/7026448_c.png','2025-10-06 14:02:09',1,NULL,NULL,NULL,NULL,14,'c'),(56,9,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7026448_gg1703o/7026448_d.png','2025-10-06 14:02:10',1,NULL,NULL,NULL,NULL,14,'d'),(57,9,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7535091_gg1703o/7535091_a.png','2025-10-06 14:02:10',1,NULL,NULL,NULL,NULL,15,'a'),(58,9,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7535091_gg1703o/7535091_b.png','2025-10-06 14:02:11',1,NULL,NULL,'2025-10-06 14:17:25',1,15,'b'),(59,9,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7535091_gg1703o/7535091_c.png','2025-10-06 14:02:11',1,NULL,NULL,NULL,NULL,15,'c'),(60,9,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/7535091_gg1703o/7535091_d.png','2025-10-06 14:02:11',1,NULL,NULL,NULL,NULL,15,'d'),(61,9,'https://testbucket21045081.s3.ap-southeast-2.amazonaws.com/product_images/9-15_gg1703o/9-15_b.png','2025-10-06 14:17:52',1,NULL,NULL,NULL,NULL,15,'b');
/*!40000 ALTER TABLE `product_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_thickness_compatibility`
--

DROP TABLE IF EXISTS `product_thickness_compatibility`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_thickness_compatibility` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint DEFAULT NULL,
  `lens_thickness_id` bigint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `lens_thickness_id` (`lens_thickness_id`),
  CONSTRAINT `product_thickness_compatibility_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `product_thickness_compatibility_ibfk_2` FOREIGN KEY (`lens_thickness_id`) REFERENCES `lens_thickness` (`id`),
  CONSTRAINT `product_thickness_compatibility_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `product_thickness_compatibility_ibfk_4` FOREIGN KEY (`lens_thickness_id`) REFERENCES `lens_thickness` (`id`),
  CONSTRAINT `product_thickness_compatibility_ibfk_5` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `product_thickness_compatibility_ibfk_6` FOREIGN KEY (`lens_thickness_id`) REFERENCES `lens_thickness` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_thickness_compatibility`
--

LOCK TABLES `product_thickness_compatibility` WRITE;
/*!40000 ALTER TABLE `product_thickness_compatibility` DISABLE KEYS */;
INSERT INTO `product_thickness_compatibility` VALUES (1,1,1,'2025-08-11 04:04:29',1,'2025-08-11 04:04:29',1,'2025-08-11 04:09:09',1),(2,1,2,'2025-08-11 04:04:29',1,'2025-08-11 04:04:29',1,'2025-08-11 04:09:09',1),(3,1,3,'2025-08-11 04:04:29',1,'2025-08-11 04:04:29',1,'2025-08-11 04:09:09',1),(4,1,4,'2025-08-11 04:04:29',1,'2025-08-11 04:04:29',1,'2025-08-11 04:09:09',1),(5,1,1,'2025-08-11 04:09:09',1,'2025-08-11 04:09:09',1,'2025-08-11 04:17:04',1),(6,1,2,'2025-08-11 04:09:09',1,'2025-08-11 04:09:09',1,'2025-08-11 04:17:04',1),(7,1,3,'2025-08-11 04:09:09',1,'2025-08-11 04:09:09',1,'2025-08-11 04:17:04',1),(8,1,4,'2025-08-11 04:09:09',1,'2025-08-11 04:09:09',1,'2025-08-11 04:17:04',1),(9,1,1,'2025-08-11 04:17:04',1,'2025-08-11 04:17:04',1,'2025-08-11 04:19:35',1),(10,1,2,'2025-08-11 04:17:04',1,'2025-08-11 04:17:04',1,'2025-08-11 04:19:35',1),(11,1,3,'2025-08-11 04:17:04',1,'2025-08-11 04:17:04',1,'2025-08-11 04:19:35',1),(12,1,4,'2025-08-11 04:17:04',1,'2025-08-11 04:17:04',1,'2025-08-11 04:19:35',1),(13,1,1,'2025-08-11 04:19:35',1,'2025-08-11 04:19:35',1,'2025-08-11 04:39:59',1),(14,1,2,'2025-08-11 04:19:35',1,'2025-08-11 04:19:35',1,'2025-08-11 04:39:59',1),(15,1,3,'2025-08-11 04:19:35',1,'2025-08-11 04:19:35',1,'2025-08-11 04:39:59',1),(16,1,4,'2025-08-11 04:19:35',1,'2025-08-11 04:19:35',1,'2025-08-11 04:39:59',1),(17,1,1,'2025-08-11 04:39:59',1,'2025-08-11 04:39:59',1,'2025-08-11 04:40:26',1),(18,1,2,'2025-08-11 04:39:59',1,'2025-08-11 04:39:59',1,'2025-08-11 04:40:26',1),(19,1,3,'2025-08-11 04:39:59',1,'2025-08-11 04:39:59',1,'2025-08-11 04:40:26',1),(20,1,4,'2025-08-11 04:39:59',1,'2025-08-11 04:39:59',1,'2025-08-11 04:40:26',1),(21,1,1,'2025-08-11 04:40:26',1,'2025-08-11 04:40:26',1,'2025-08-11 04:41:15',1),(22,1,2,'2025-08-11 04:40:26',1,'2025-08-11 04:40:26',1,'2025-08-11 04:41:15',1),(23,1,3,'2025-08-11 04:40:26',1,'2025-08-11 04:40:26',1,'2025-08-11 04:41:15',1),(24,1,4,'2025-08-11 04:40:26',1,'2025-08-11 04:40:26',1,'2025-08-11 04:41:15',1),(25,1,1,'2025-08-11 04:41:15',1,'2025-08-11 04:41:15',1,'2025-08-11 04:41:30',1),(26,1,2,'2025-08-11 04:41:15',1,'2025-08-11 04:41:15',1,'2025-08-11 04:41:30',1),(27,1,3,'2025-08-11 04:41:15',1,'2025-08-11 04:41:15',1,'2025-08-11 04:41:30',1),(28,1,4,'2025-08-11 04:41:15',1,'2025-08-11 04:41:15',1,'2025-08-11 04:41:30',1),(29,1,1,'2025-08-11 04:41:30',1,'2025-08-11 04:41:30',1,'2025-08-11 04:48:43',1),(30,1,2,'2025-08-11 04:41:30',1,'2025-08-11 04:41:30',1,'2025-08-11 04:48:43',1),(31,1,3,'2025-08-11 04:41:30',1,'2025-08-11 04:41:30',1,'2025-08-11 04:48:43',1),(32,1,4,'2025-08-11 04:41:30',1,'2025-08-11 04:41:30',1,'2025-08-11 04:48:43',1),(33,1,1,'2025-08-11 04:48:43',1,'2025-08-11 04:48:43',1,'2025-08-11 09:41:20',1),(34,1,2,'2025-08-11 04:48:43',1,'2025-08-11 04:48:43',1,'2025-08-11 09:41:20',1),(35,1,3,'2025-08-11 04:48:43',1,'2025-08-11 04:48:43',1,'2025-08-11 09:41:20',1),(36,1,4,'2025-08-11 04:48:43',1,'2025-08-11 04:48:43',1,'2025-08-11 09:41:20',1),(37,1,1,'2025-08-11 09:41:20',1,'2025-08-11 09:41:20',1,'2025-09-03 10:34:14',1),(38,1,2,'2025-08-11 09:41:20',1,'2025-08-11 09:41:20',1,'2025-09-03 10:34:14',1),(39,1,3,'2025-08-11 09:41:20',1,'2025-08-11 09:41:20',1,'2025-09-03 10:34:14',1),(40,1,4,'2025-08-11 09:41:20',1,'2025-08-11 09:41:20',1,'2025-09-03 10:34:14',1),(41,2,1,'2025-08-12 03:43:35',1,'2025-08-12 03:43:35',1,NULL,NULL),(42,2,2,'2025-08-12 03:43:35',1,'2025-08-12 03:43:35',1,NULL,NULL),(43,2,3,'2025-08-12 03:43:35',1,'2025-08-12 03:43:35',1,NULL,NULL),(44,2,4,'2025-08-12 03:43:35',1,'2025-08-12 03:43:35',1,NULL,NULL),(45,3,1,'2025-08-12 04:32:46',1,'2025-08-12 04:32:46',1,'2025-09-03 23:16:00',1),(46,3,2,'2025-08-12 04:32:46',1,'2025-08-12 04:32:46',1,'2025-09-03 23:16:00',1),(47,3,3,'2025-08-12 04:32:46',1,'2025-08-12 04:32:46',1,'2025-09-03 23:16:00',1),(48,3,4,'2025-08-12 04:32:46',1,'2025-08-12 04:32:46',1,'2025-09-03 23:16:00',1),(49,4,1,'2025-08-14 02:34:28',1,'2025-08-14 02:34:28',1,NULL,NULL),(50,4,4,'2025-08-14 02:34:28',1,'2025-08-14 02:34:28',1,NULL,NULL),(51,4,3,'2025-08-14 02:34:28',1,'2025-08-14 02:34:28',1,NULL,NULL),(52,4,2,'2025-08-14 02:34:28',1,'2025-08-14 02:34:28',1,NULL,NULL),(53,1,1,'2025-09-03 10:34:14',1,'2025-09-03 10:34:14',1,'2025-09-03 10:34:20',1),(54,1,3,'2025-09-03 10:34:14',1,'2025-09-03 10:34:14',1,'2025-09-03 10:34:20',1),(55,1,4,'2025-09-03 10:34:14',1,'2025-09-03 10:34:14',1,'2025-09-03 10:34:20',1),(56,1,1,'2025-09-03 10:34:20',1,'2025-09-03 10:34:20',1,'2025-09-03 22:56:00',1),(57,1,3,'2025-09-03 10:34:20',1,'2025-09-03 10:34:20',1,'2025-09-03 22:56:00',1),(58,1,4,'2025-09-03 10:34:20',1,'2025-09-03 10:34:20',1,'2025-09-03 22:56:00',1),(59,1,2,'2025-09-03 10:34:20',1,'2025-09-03 10:34:20',1,'2025-09-03 22:56:00',1),(60,1,1,'2025-09-03 22:56:00',1,'2025-09-03 22:56:00',1,NULL,NULL),(61,1,3,'2025-09-03 22:56:00',1,'2025-09-03 22:56:00',1,NULL,NULL),(62,1,4,'2025-09-03 22:56:00',1,'2025-09-03 22:56:00',1,NULL,NULL),(63,1,2,'2025-09-03 22:56:00',1,'2025-09-03 22:56:00',1,NULL,NULL),(64,3,1,'2025-09-03 23:16:00',1,'2025-09-03 23:16:00',1,NULL,NULL),(65,3,2,'2025-09-03 23:16:00',1,'2025-09-03 23:16:00',1,NULL,NULL),(66,3,3,'2025-09-03 23:16:00',1,'2025-09-03 23:16:00',1,NULL,NULL),(67,3,4,'2025-09-03 23:16:00',1,'2025-09-03 23:16:00',1,NULL,NULL),(68,5,1,'2025-09-29 11:43:40',1,'2025-09-29 11:43:40',1,NULL,NULL),(69,5,2,'2025-09-29 11:43:40',1,'2025-09-29 11:43:40',1,NULL,NULL),(70,5,3,'2025-09-29 11:43:40',1,'2025-09-29 11:43:40',1,NULL,NULL),(71,5,4,'2025-09-29 11:43:40',1,'2025-09-29 11:43:40',1,NULL,NULL),(72,7,1,'2025-10-03 18:52:52',1,'2025-10-03 18:52:52',1,'2025-10-03 18:55:56',1),(73,7,2,'2025-10-03 18:52:52',1,'2025-10-03 18:52:52',1,'2025-10-03 18:55:56',1),(74,7,3,'2025-10-03 18:52:52',1,'2025-10-03 18:52:52',1,'2025-10-03 18:55:56',1),(75,7,4,'2025-10-03 18:52:52',1,'2025-10-03 18:52:52',1,'2025-10-03 18:55:56',1),(76,7,1,'2025-10-03 18:55:56',1,'2025-10-03 18:55:56',1,'2025-10-03 18:57:27',1),(77,7,2,'2025-10-03 18:55:56',1,'2025-10-03 18:55:56',1,'2025-10-03 18:57:27',1),(78,7,3,'2025-10-03 18:55:56',1,'2025-10-03 18:55:56',1,'2025-10-03 18:57:27',1),(79,7,4,'2025-10-03 18:55:56',1,'2025-10-03 18:55:56',1,'2025-10-03 18:57:27',1),(80,7,1,'2025-10-03 18:57:27',1,'2025-10-03 18:57:27',1,NULL,NULL),(81,7,2,'2025-10-03 18:57:27',1,'2025-10-03 18:57:27',1,NULL,NULL),(82,7,3,'2025-10-03 18:57:27',1,'2025-10-03 18:57:27',1,NULL,NULL),(83,7,4,'2025-10-03 18:57:27',1,'2025-10-03 18:57:27',1,NULL,NULL),(84,8,1,'2025-10-03 19:16:52',1,'2025-10-03 19:16:52',1,NULL,NULL),(85,8,2,'2025-10-03 19:16:52',1,'2025-10-03 19:16:52',1,NULL,NULL),(86,8,3,'2025-10-03 19:16:52',1,'2025-10-03 19:16:52',1,NULL,NULL),(87,8,4,'2025-10-03 19:16:52',1,'2025-10-03 19:16:52',1,NULL,NULL),(88,9,1,'2025-10-06 14:02:08',1,'2025-10-06 14:02:08',1,'2025-10-06 14:17:51',1),(89,9,2,'2025-10-06 14:02:08',1,'2025-10-06 14:02:08',1,'2025-10-06 14:17:51',1),(90,9,3,'2025-10-06 14:02:08',1,'2025-10-06 14:02:08',1,'2025-10-06 14:17:51',1),(91,9,4,'2025-10-06 14:02:08',1,'2025-10-06 14:02:08',1,'2025-10-06 14:17:51',1),(92,9,1,'2025-10-06 14:17:51',1,'2025-10-06 14:17:51',1,NULL,NULL),(93,9,2,'2025-10-06 14:17:51',1,'2025-10-06 14:17:51',1,NULL,NULL),(94,9,3,'2025-10-06 14:17:51',1,'2025-10-06 14:17:51',1,NULL,NULL),(95,9,4,'2025-10-06 14:17:51',1,'2025-10-06 14:17:51',1,NULL,NULL);
/*!40000 ALTER TABLE `product_thickness_compatibility` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `review_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `review_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `review_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `review_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `review_ibfk_5` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `review_ibfk_6` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `review_ibfk_7` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `review_ibfk_8` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'admin','2025-08-10 03:46:55',1,NULL,NULL,NULL,NULL),(2,'employee','2025-08-10 03:47:00',1,NULL,NULL,NULL,NULL),(3,'user','2025-08-10 03:47:04',1,NULL,NULL,NULL,NULL),(4,'guest','2025-08-10 03:47:07',1,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `session` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `session_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `session_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `session_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `session_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=230 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session`
--

LOCK TABLES `session` WRITE;
/*!40000 ALTER TABLE `session` DISABLE KEYS */;
INSERT INTO `session` VALUES (1,1,'LOGOUT','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','::1',0,'2025-08-10 03:47:47',1,'2025-08-11 01:44:39',1,NULL,NULL),(2,1,'LOGOUT','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','::1',0,'2025-08-11 01:44:41',1,'2025-08-11 07:04:10',1,NULL,NULL),(3,2,'LOGOUT','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','::1',0,'2025-08-11 07:04:38',2,'2025-08-11 07:05:22',2,NULL,NULL),(4,2,'LOGOUT','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','::1',0,'2025-08-11 07:06:08',2,'2025-08-11 07:17:59',2,NULL,NULL),(5,2,'LOGOUT','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','::1',0,'2025-08-11 07:18:15',2,'2025-08-11 07:18:22',2,NULL,NULL),(6,1,'LOGOUT','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','::1',0,'2025-08-11 08:18:04',1,'2025-08-11 08:18:10',1,NULL,NULL),(7,2,'LOGOUT','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','::1',0,'2025-08-11 08:21:17',2,'2025-08-11 08:54:28',2,NULL,NULL),(8,2,'LOGOUT','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','::1',0,'2025-08-11 09:03:52',2,'2025-08-11 09:38:50',2,NULL,NULL),(9,1,'LOGIN','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','::1',1,'2025-08-11 09:38:54',1,NULL,NULL,NULL,NULL),(10,1,'LOGIN','PostmanRuntime/7.45.0','::1',1,'2025-08-13 07:13:22',1,NULL,NULL,NULL,NULL),(11,1,'LOGIN','PostmanRuntime/7.45.0','::1',1,'2025-08-13 07:13:25',1,NULL,NULL,NULL,NULL),(12,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','::1',0,'2025-08-19 14:28:35',1,'2025-09-03 14:30:27',1,NULL,NULL),(13,1,'LOGIN','PostmanRuntime/7.45.0','::1',1,'2025-08-19 14:34:58',1,NULL,NULL,NULL,NULL),(14,2,'RESET_PASSWORD','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','::1',0,'2025-09-03 14:33:53',2,'2025-09-03 14:33:53',2,NULL,NULL),(15,2,'RESET_PASSWORD','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','::1',0,'2025-09-03 14:34:54',2,'2025-09-03 14:34:54',2,NULL,NULL),(16,2,'RESET_PASSWORD','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','::1',0,'2025-09-03 14:35:45',2,'2025-09-03 14:35:45',2,NULL,NULL),(17,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','::1',0,'2025-09-03 14:39:05',1,'2025-09-03 14:43:24',1,NULL,NULL),(18,2,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','::1',0,'2025-09-03 14:43:31',2,'2025-09-03 15:59:23',2,NULL,NULL),(19,2,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','::1',0,'2025-09-03 15:59:34',2,'2025-09-03 16:00:29',2,NULL,NULL),(20,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','::1',0,'2025-09-03 16:00:40',1,'2025-09-03 22:40:21',1,NULL,NULL),(21,2,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','::1',0,'2025-09-03 22:40:43',2,'2025-09-03 22:40:54',2,NULL,NULL),(22,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','::1',0,'2025-09-03 22:41:02',1,'2025-09-03 22:48:58',1,NULL,NULL),(23,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','::1',0,'2025-09-03 22:49:07',1,'2025-09-06 16:44:19',1,NULL,NULL),(24,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','::1',0,'2025-09-06 16:44:27',1,'2025-09-06 16:44:30',1,NULL,NULL),(25,2,'RESET_PASSWORD','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','::1',0,'2025-09-06 16:44:34',2,'2025-09-06 16:44:34',2,NULL,NULL),(26,2,'RESET_PASSWORD','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','::1',0,'2025-09-06 16:45:31',2,'2025-09-06 16:45:31',2,NULL,NULL),(27,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','::1',0,'2025-09-06 16:48:41',1,'2025-09-06 16:48:46',1,NULL,NULL),(28,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','::1',0,'2025-09-06 16:48:59',1,'2025-09-09 13:24:29',1,NULL,NULL),(29,2,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','::1',0,'2025-09-09 13:24:36',2,'2025-09-09 13:24:47',2,NULL,NULL),(30,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','::1',0,'2025-09-09 13:24:50',1,'2025-09-19 16:02:48',1,NULL,NULL),(31,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(32,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(33,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(34,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(35,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(36,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(37,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(38,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(39,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(40,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(41,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(42,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(43,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(44,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(45,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(46,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(47,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(48,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(49,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(50,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(51,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(52,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(53,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(54,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(55,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(56,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(57,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(58,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(59,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(60,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(61,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(62,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(63,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(64,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(65,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(66,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(67,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(68,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(69,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(70,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(71,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(72,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(73,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(74,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(75,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(76,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(77,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(78,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(79,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(80,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(81,1,'LOGIN','PostmanRuntime/7.46.1','::1',1,'2025-09-19 13:34:58',1,NULL,NULL,NULL,NULL),(82,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::1',0,'2025-09-19 16:02:52',1,'2025-09-19 22:20:49',1,NULL,NULL),(83,2,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::1',0,'2025-09-19 22:20:59',2,'2025-09-19 22:21:11',2,NULL,NULL),(84,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::1',0,'2025-09-19 22:21:14',1,'2025-09-27 23:20:20',1,NULL,NULL),(85,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(86,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(87,2,'LOGOUT','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36','::1',0,'2025-09-27 23:20:28',2,'2025-09-27 23:20:40',2,NULL,NULL),(88,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::1',0,'2025-09-27 23:20:44',1,'2025-09-27 23:21:15',1,NULL,NULL),(89,2,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::1',0,'2025-09-27 23:21:22',2,'2025-09-27 23:34:54',2,NULL,NULL),(90,1,'LOGOUT','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36','::1',0,'2025-09-27 23:34:58',1,'2025-09-27 23:43:24',1,NULL,NULL),(91,2,'LOGOUT','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36','::1',0,'2025-09-27 23:43:34',2,'2025-09-27 23:44:48',2,NULL,NULL),(92,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::1',0,'2025-09-27 23:44:55',1,'2025-09-28 00:48:42',1,NULL,NULL),(93,1,'LOGOUT','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36','::1',0,'2025-09-28 00:48:50',1,'2025-09-28 22:31:48',1,NULL,NULL),(94,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::1',0,'2025-09-28 22:31:54',1,'2025-09-28 22:31:59',1,NULL,NULL),(95,2,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::1',0,'2025-09-28 22:32:08',2,'2025-09-28 22:32:21',2,NULL,NULL),(96,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::1',0,'2025-09-28 22:32:24',1,'2025-10-03 00:00:27',1,NULL,NULL),(97,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(98,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(99,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(100,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(101,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(102,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(103,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(104,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(105,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(106,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(107,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(108,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(109,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(110,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(111,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(112,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(113,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::1',0,'2025-10-03 00:00:30',1,'2025-10-03 00:25:39',1,NULL,NULL),(114,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','::1',0,'2025-10-03 00:25:43',1,'2025-10-03 00:31:31',1,NULL,NULL),(115,1,'LOGOUT','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36','::1',0,'2025-10-03 00:31:35',1,'2025-10-07 15:18:05',1,NULL,NULL),(116,1,'LOGIN','PostmanRuntime/7.48.0','::1',1,'2025-10-03 00:32:34',1,NULL,NULL,NULL,NULL),(117,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(118,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(119,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(120,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(121,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(122,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(123,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(124,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(125,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(126,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(127,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(128,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(129,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(130,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(131,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(132,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(133,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(134,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(135,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(136,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(137,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(138,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(139,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(140,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(141,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(142,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(143,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(144,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(145,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(146,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(147,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(148,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(149,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(150,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(151,4,'LOGIN','PostmanRuntime/7.48.0','::1',1,'2025-10-07 13:16:21',4,NULL,NULL,NULL,NULL),(152,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',0,'2025-10-07 15:18:21',1,'2025-10-07 15:22:15',1,NULL,NULL),(153,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(154,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',0,'2025-10-07 15:27:57',1,'2025-10-07 15:29:18',1,NULL,NULL),(155,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(156,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',0,'2025-10-07 15:51:25',1,'2025-10-07 15:52:06',1,NULL,NULL),(157,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',0,'2025-10-07 16:05:36',1,'2025-10-07 16:05:43',1,NULL,NULL),(158,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',0,'2025-10-07 23:38:19',1,'2025-10-07 23:43:00',1,NULL,NULL),(159,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',0,'2025-10-08 00:00:53',1,'2025-10-08 00:03:50',1,NULL,NULL),(160,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',0,'2025-10-08 00:10:47',1,'2025-10-08 00:13:58',1,NULL,NULL),(161,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',0,'2025-10-08 00:18:04',1,'2025-10-08 00:18:15',1,NULL,NULL),(162,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',0,'2025-10-08 00:27:03',1,'2025-10-08 00:28:37',1,NULL,NULL),(163,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(164,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(165,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(166,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(167,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(168,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(169,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(170,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(171,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(172,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(173,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(174,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(175,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(176,2,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',0,'2025-10-08 15:03:11',2,'2025-10-08 15:19:00',2,NULL,NULL),(177,2,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',0,'2025-10-08 15:19:06',2,'2025-10-08 15:20:48',2,NULL,NULL),(178,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',0,'2025-10-08 15:21:02',1,'2025-10-08 15:24:07',1,NULL,NULL),(179,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',0,'2025-10-08 15:28:12',1,'2025-10-08 15:37:21',1,NULL,NULL),(180,1,'LOGOUT','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36','::1',0,'2025-10-08 15:41:42',1,'2025-10-08 15:42:27',1,NULL,NULL),(181,2,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',0,'2025-10-08 15:42:37',2,'2025-10-08 15:43:02',2,NULL,NULL),(182,2,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',0,'2025-10-08 15:43:33',2,'2025-10-08 15:44:12',2,NULL,NULL),(183,2,'LOGOUT','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36','::1',0,'2025-10-08 15:44:42',2,'2025-10-08 15:47:49',2,NULL,NULL),(184,1,'LOGOUT','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36','::1',0,'2025-10-08 15:48:06',1,'2025-10-08 15:48:14',1,NULL,NULL),(185,2,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',0,'2025-10-08 15:48:51',2,'2025-10-08 15:49:39',2,NULL,NULL),(186,2,'LOGOUT','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36','::1',0,'2025-10-08 15:53:22',2,'2025-10-08 15:55:03',2,NULL,NULL),(187,2,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',0,'2025-10-08 15:56:38',2,'2025-10-08 22:34:27',2,NULL,NULL),(188,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',0,'2025-10-08 22:34:30',1,'2025-10-10 20:00:09',1,NULL,NULL),(189,2,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',0,'2025-10-10 20:00:15',2,'2025-10-10 20:59:51',2,NULL,NULL),(190,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(191,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',0,'2025-10-10 20:59:53',1,'2025-10-10 21:18:10',1,NULL,NULL),(192,2,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',0,'2025-10-10 21:18:18',2,'2025-10-10 21:30:06',2,NULL,NULL),(193,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(194,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(195,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',0,'2025-10-10 21:30:12',1,'2025-10-18 11:17:43',1,NULL,NULL),(196,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(197,2,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',0,'2025-10-18 11:18:00',2,'2025-10-18 11:18:50',2,NULL,NULL),(198,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',0,'2025-10-18 11:18:59',1,'2025-10-20 10:33:25',1,NULL,NULL),(199,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',0,'2025-10-20 10:33:36',1,'2025-10-20 10:37:31',1,NULL,NULL),(200,2,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',0,'2025-10-20 10:37:36',2,'2025-10-20 10:46:01',2,NULL,NULL),(201,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',0,'2025-10-20 10:46:07',1,'2025-10-20 23:57:02',1,NULL,NULL),(202,2,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',0,'2025-10-20 23:57:07',2,'2025-10-20 23:58:52',2,NULL,NULL),(203,1,'LOGIN','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','::1',1,'2025-10-20 23:58:55',1,NULL,NULL,NULL,NULL),(204,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36','::1',0,'2025-11-17 17:19:44',1,'2025-11-19 05:27:02',1,NULL,NULL),(205,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(206,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(207,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(208,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(209,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(210,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(211,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36','::1',0,'2025-11-19 07:41:21',1,'2025-11-19 09:13:39',1,NULL,NULL),(212,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(213,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(214,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(215,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(216,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(217,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(218,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(219,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(220,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(221,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(222,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(223,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(224,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(225,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(226,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(227,NULL,'anonymous_ai',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL),(228,1,'LOGOUT','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36','::1',0,'2025-11-19 09:13:45',1,'2025-11-20 08:09:18',1,NULL,NULL),(229,1,'LOGIN','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36','::1',1,'2025-11-20 08:25:41',1,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `role_id` bigint DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  CONSTRAINT `user_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  CONSTRAINT `user_ibfk_3` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  CONSTRAINT `user_ibfk_4` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,1,'admin','$2b$10$yFVqJbs4kVe7KOt6R0Xf..JpiBSr8adKXe9q0crJRURz.GijFGvLO','admin@matnice.com','2025-08-10 03:47:27',1,NULL,NULL,NULL,NULL),(2,3,'user','$2b$10$lhSlNBb.Ij2jdlICl/8Bv.ESSWaAad1Dvf9wuBwKREVuSz3OSkQSC','giahuy260123@gmail.com','2025-08-11 07:04:34',2,NULL,NULL,NULL,NULL),(3,3,'employee1','$2b$10$QSU63/h.VyRbp/fAtJ6LreElhJFrioHw.9sIe5jcwmD1bs9uuqYl.','employee@matnice.com','2025-09-06 14:57:03',3,NULL,NULL,NULL,NULL),(4,3,'testuser','$2b$10$Pjdc5.BOhtnDCQv6y01Ig.NaaKVtiYL7oFW7ZGqdpH38gskSO8fxu','testuser@example.com','2025-10-07 13:15:57',4,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_address`
--

DROP TABLE IF EXISTS `user_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_address` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `province` varchar(255) NOT NULL,
  `district` varchar(255) NOT NULL,
  `ward` varchar(255) NOT NULL,
  `address_detail` varchar(255) NOT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `notes` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_address_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_address`
--

LOCK TABLES `user_address` WRITE;
/*!40000 ALTER TABLE `user_address` DISABLE KEYS */;
INSERT INTO `user_address` VALUES (1,2,'Thành phố Hồ Chí Minh','Quận Gò Vấp','Phường 6','496/21 Dương Quảng Hàm',1,NULL,'2025-10-08 15:18:35',2,NULL,NULL,NULL,NULL),(2,2,'Thành phố Hà Nội','Quận Ba Đình','Phường Phúc Xá','Hong biet nua',0,NULL,'2025-10-08 15:18:47',2,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `user_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_detail`
--

DROP TABLE IF EXISTS `user_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_detail` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `user_detail_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `user_detail_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `user_detail_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `user_detail_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_detail`
--

LOCK TABLES `user_detail` WRITE;
/*!40000 ALTER TABLE `user_detail` DISABLE KEYS */;
INSERT INTO `user_detail` VALUES (1,1,NULL,NULL,NULL,NULL,'2025-08-10 03:47:27',1,NULL,NULL,NULL,NULL),(2,2,NULL,NULL,NULL,NULL,'2025-08-11 07:04:34',2,NULL,NULL,NULL,NULL),(3,3,NULL,NULL,NULL,NULL,'2025-09-06 14:57:03',3,NULL,NULL,NULL,NULL),(4,4,NULL,NULL,NULL,NULL,'2025-10-07 13:15:57',4,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `user_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_prescription`
--

DROP TABLE IF EXISTS `user_prescription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_prescription` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `right_eye_sph` decimal(4,2) NOT NULL,
  `right_eye_cyl` decimal(4,2) DEFAULT NULL,
  `right_eye_axis` int DEFAULT NULL,
  `left_eye_sph` decimal(4,2) NOT NULL,
  `left_eye_cyl` decimal(4,2) DEFAULT NULL,
  `left_eye_axis` int DEFAULT NULL,
  `pd_left` decimal(4,1) DEFAULT NULL,
  `pd_right` decimal(4,1) DEFAULT NULL,
  `left_eye_add` decimal(4,2) DEFAULT NULL,
  `right_eye_add` decimal(4,2) DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_prescription_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_prescription`
--

LOCK TABLES `user_prescription` WRITE;
/*!40000 ALTER TABLE `user_prescription` DISABLE KEYS */;
INSERT INTO `user_prescription` VALUES (1,1,-5.75,0.00,0,0.00,0.00,0,32.0,32.0,NULL,NULL,'à hú','2025-10-18 10:10:16',1,NULL,NULL,NULL,NULL,0),(2,1,0.00,0.00,0,-3.50,0.00,0,32.0,32.0,NULL,NULL,'','2025-10-18 10:19:28',1,NULL,NULL,NULL,NULL,0),(3,1,0.00,0.00,0,0.00,0.00,0,32.0,32.0,NULL,NULL,'','2025-10-18 10:42:06',1,'2025-10-18 10:42:10',1,NULL,NULL,0),(4,1,0.00,0.00,0,0.00,0.00,0,32.0,32.0,NULL,NULL,'','2025-10-18 10:42:10',1,'2025-10-18 10:42:12',1,NULL,NULL,0),(5,1,0.00,0.00,0,0.00,0.00,0,32.0,32.0,NULL,NULL,'','2025-10-18 10:42:12',1,'2025-10-18 10:42:16',1,NULL,NULL,0),(6,1,0.00,0.00,0,0.00,0.00,0,32.0,32.0,NULL,NULL,'','2025-10-18 10:42:16',1,'2025-10-20 15:48:46',1,NULL,NULL,0),(7,1,0.00,0.00,0,0.00,0.00,0,32.0,32.0,1.75,1.50,'aaa','2025-10-20 15:48:46',1,NULL,NULL,NULL,NULL,1);
/*!40000 ALTER TABLE `user_prescription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist_item`
--

DROP TABLE IF EXISTS `wishlist_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist_item` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `item_type` varchar(255) NOT NULL,
  `product_id` bigint DEFAULT NULL,
  `lens_id` bigint DEFAULT NULL,
  `selected_color_id` bigint DEFAULT NULL,
  `added_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  KEY `lens_id` (`lens_id`),
  KEY `selected_color_id` (`selected_color_id`),
  CONSTRAINT `wishlist_item_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `wishlist_item_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `wishlist_item_ibfk_3` FOREIGN KEY (`lens_id`) REFERENCES `lens` (`id`),
  CONSTRAINT `wishlist_item_ibfk_4` FOREIGN KEY (`selected_color_id`) REFERENCES `product_color` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist_item`
--

LOCK TABLES `wishlist_item` WRITE;
/*!40000 ALTER TABLE `wishlist_item` DISABLE KEYS */;
INSERT INTO `wishlist_item` VALUES (1,1,'product',9,NULL,NULL,'2025-10-13 15:45:52','2025-10-13 15:45:52',1,NULL,NULL,'2025-10-16 14:29:48',1),(2,1,'product',8,NULL,NULL,'2025-10-13 15:50:47','2025-10-13 15:50:47',1,NULL,NULL,'2025-10-16 14:39:39',1),(3,1,'product',7,NULL,NULL,'2025-10-13 15:51:33','2025-10-13 15:51:33',1,NULL,NULL,'2025-10-16 14:35:41',1),(4,1,'product',5,NULL,NULL,'2025-10-13 15:53:35','2025-10-13 15:53:35',1,NULL,NULL,'2025-10-16 14:39:39',1),(5,1,'product',1,NULL,NULL,'2025-10-13 15:55:23','2025-10-13 15:55:23',1,NULL,NULL,'2025-10-16 14:39:38',1),(6,1,'product',3,NULL,NULL,'2025-10-13 16:01:42','2025-10-13 16:01:42',1,NULL,NULL,'2025-10-16 14:39:34',1),(7,1,'product',9,NULL,NULL,'2025-10-16 14:29:50','2025-10-16 14:29:50',1,NULL,NULL,'2025-10-16 14:35:34',1),(8,1,'product',2,NULL,NULL,'2025-10-16 14:29:58','2025-10-16 14:29:58',1,NULL,NULL,'2025-10-16 14:39:34',1),(9,1,'product',9,NULL,NULL,'2025-10-16 14:35:35','2025-10-16 14:35:35',1,NULL,NULL,'2025-10-16 14:35:38',1),(10,1,'product',9,NULL,NULL,'2025-10-16 14:35:39','2025-10-16 14:35:39',1,NULL,NULL,'2025-10-16 14:39:33',1),(11,1,'product',7,NULL,NULL,'2025-10-16 14:35:42','2025-10-16 14:35:42',1,NULL,NULL,'2025-10-16 14:39:33',1),(12,1,'product',9,NULL,NULL,'2025-10-16 14:40:08','2025-10-16 14:40:08',1,NULL,NULL,'2025-10-16 14:44:21',1),(13,1,'product',9,NULL,NULL,'2025-10-16 14:44:37','2025-10-16 14:44:37',1,NULL,NULL,'2025-10-16 15:05:22',1),(14,1,'product',8,NULL,NULL,'2025-10-16 15:05:12','2025-10-16 15:05:12',1,NULL,NULL,'2025-10-16 15:05:22',1),(15,1,'product',7,NULL,NULL,'2025-10-16 15:05:16','2025-10-16 15:05:16',1,NULL,NULL,'2025-10-16 15:05:21',1),(16,1,'product',5,NULL,NULL,'2025-10-16 15:05:24','2025-10-16 15:05:24',1,NULL,NULL,NULL,NULL),(17,1,'product',9,NULL,NULL,'2025-10-16 15:05:27','2025-10-16 15:05:27',1,NULL,NULL,'2025-10-16 15:40:10',1),(18,1,'product',8,NULL,NULL,'2025-10-16 15:05:37','2025-10-16 15:05:37',1,NULL,NULL,'2025-11-19 03:06:52',1),(19,1,'product',7,NULL,NULL,'2025-10-16 15:14:58','2025-10-16 15:14:58',1,NULL,NULL,NULL,NULL),(20,1,'product',4,NULL,NULL,'2025-10-16 15:36:09','2025-10-16 15:36:09',1,NULL,NULL,NULL,NULL),(21,1,'product',9,NULL,NULL,'2025-10-16 15:40:11','2025-10-16 15:40:11',1,NULL,NULL,'2025-11-19 03:06:48',1),(22,1,'product',6,NULL,NULL,'2025-10-16 15:55:13','2025-10-16 15:55:13',1,NULL,NULL,NULL,NULL),(23,1,'product',9,NULL,NULL,'2025-11-19 03:06:50','2025-11-19 03:06:50',1,NULL,NULL,NULL,NULL),(24,1,'product',8,NULL,NULL,'2025-11-19 03:06:52','2025-11-19 03:06:52',1,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `wishlist_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'mat_nice_ecommerce'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-20 15:57:41
