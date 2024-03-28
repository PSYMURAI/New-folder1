-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 26, 2023 at 08:26 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mydatabase`
--

-- --------------------------------------------------------

--
-- Stand-in structure for view `adddata`
-- (See below for the actual view)
--
CREATE TABLE `adddata` (
`name` varchar(255)
,`collegeName` varchar(255)
,`mobile` char(10)
,`email` varchar(255)
,`eventDay1` varchar(255)
,`eventDay2` varchar(255)
,`eventday3` varchar(255)
,`paymentImage` varchar(255)
,`token` varchar(20)
,`date_time_submit` datetime
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `admin_record`
-- (See below for the actual view)
--
CREATE TABLE `admin_record` (
`id` int(11)
,`name` varchar(255)
,`collegeName` varchar(255)
,`mobile` char(10)
,`email` varchar(255)
,`eventDay1` varchar(255)
,`eventDay2` varchar(255)
,`eventDay3` varchar(255)
,`paymentImage` varchar(255)
,`date_time_submit` datetime
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `display`
-- (See below for the actual view)
--
CREATE TABLE `display` (
`email` varchar(255)
,`mobile` char(10)
);

-- --------------------------------------------------------

--
-- Table structure for table `form_data`
--

CREATE TABLE `form_data` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `collegeName` varchar(255) DEFAULT NULL,
  `mobile` char(10) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `eventDay1` varchar(255) DEFAULT NULL,
  `eventDay2` varchar(255) DEFAULT NULL,
  `eventDay3` varchar(255) DEFAULT NULL,
  `paymentImage` varchar(255) DEFAULT NULL,
  `token` varchar(20) NOT NULL,
  `date_time_submit` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `form_data`
--

INSERT INTO `form_data` (`id`, `name`, `collegeName`, `mobile`, `email`, `eventDay1`, `eventDay2`, `eventDay3`, `paymentImage`, `token`, `date_time_submit`) VALUES
(65, 'dhananjay kakade', 'fgdfg', '0976507352', 'kakadedhananjay59@gmail.com', 'event 2', 'event 12', 'event 21', '2023-11-06_22-59-04_mcgk0001.jpg', 'mcgk0001', '2023-11-06 22:59:04'),
(66, 'dhananjay kakade', 'fgdfg', '6576567566', 'kakadedhananjay5656759@gmail.com', 'none', 'none', 'none', '2023-11-07_00-01-21_mcgk0001.jpg', 'mcgk0001', '2023-11-07 00:01:21'),
(73, 'dhananjay kakade', 'fgdfg', '8888888888', 'kakadedhananjay58889@gmail.com', 'event 2', 'event 12', 'event 22', '2023-11-07_12-58-35_mcgk0001.jpg', 'mcgk0001', '2023-11-07 12:58:35'),
(74, 'dhananjay kakade', 'fgdfg', '9999999999', 'kakadedhananjay59999@gmail.com', 'event 2', 'event 11', 'event 22', '2023-11-07_13-27-24_mcgk0001.jpg', 'mcgk0001', '2023-11-07 13:27:24'),
(75, 'giuer', 'college', '9292929299', 'kakadedhananjay59222222@gmail.com', 'creativity_club', 'quantumAssembler', 'gamer_strike', '2023-12-03_16-40-53_mcgk0001.jpg', 'mcgk0001', '2023-12-03 16:40:53'),
(76, 'aaaa', 'iukui', '0976507521', 'kakadedhananjay5erwer9@gmail.com', 'creativity_club', 'quantumAssembler', 'gamer_strike', '2023-12-03_17-58-55_mcgk0001.jpg', 'mcgk0001', '2023-12-03 17:58:55'),
(77, 'abcd', 'nceuw', '9999999776', 'dem@gmail.com', 'brain_battle', 'quantumAssembler', 'gamer_strike', '2023-12-20_13-48-47_mcgk0001.jpg', 'mcgk0001', '2023-12-20 13:48:47'),
(78, 'febifw', 'shbba', '3333333333', 'jsndia@fma.owid', 'creativity_club', 'hackTheDark', 'gold_rush', '2023-12-21_15-34-45_mcgk0001.jpg', 'mcgk0001', '2023-12-21 15:34:45'),
(79, 'dhananjay kakade', 'www', '1212121212', 'kakadedh@gmail.com', 'brain_battle', 'quantumAssembler', 'gamer_strike', '2023-12-21_15-36-05_mcgk0001.jpg', 'mcgk0001', '2023-12-21 15:36:05'),
(80, 'dhananjay kakade', 'fgdfg', '0454545454', 'kakadedhananjay5945454@gmail.com', 'creativity_club', 'quantumAssembler', 'gamer_strike', '2023-12-24_10-53-03_mcgk0001.jpg', 'mcgk0001', '2023-12-24 10:53:03'),
(81, 'dhananjay kakade', 'www', '0976666666', 'kakadedhananjay55559@gmail.com', 'none', 'quantumAssembler', 'gold_rush', '2023-12-24_11-00-46_mcgk0001.jpg', 'mcgk0001', '2023-12-24 11:00:46'),
(82, 'dhananjay kakade', 'fgdfg', '4444444444', 'kakadedhananjay53333333339@gmail.com', 'creativity_club', 'quantumAssembler', 'gamer_strike', '2023-12-26_12-39-55_mcgk0001.jpg', 'mcgk0001', '2023-12-26 12:39:55');

-- --------------------------------------------------------

--
-- Structure for view `adddata`
--
DROP TABLE IF EXISTS `adddata`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `adddata`  AS SELECT `form_data`.`name` AS `name`, `form_data`.`collegeName` AS `collegeName`, `form_data`.`mobile` AS `mobile`, `form_data`.`email` AS `email`, `form_data`.`eventDay1` AS `eventDay1`, `form_data`.`eventDay2` AS `eventDay2`, `form_data`.`eventDay3` AS `eventday3`, `form_data`.`paymentImage` AS `paymentImage`, `form_data`.`token` AS `token`, `form_data`.`date_time_submit` AS `date_time_submit` FROM `form_data` ;

-- --------------------------------------------------------

--
-- Structure for view `admin_record`
--
DROP TABLE IF EXISTS `admin_record`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `admin_record`  AS SELECT `form_data`.`id` AS `id`, `form_data`.`name` AS `name`, `form_data`.`collegeName` AS `collegeName`, `form_data`.`mobile` AS `mobile`, `form_data`.`email` AS `email`, `form_data`.`eventDay1` AS `eventDay1`, `form_data`.`eventDay2` AS `eventDay2`, `form_data`.`eventDay3` AS `eventDay3`, `form_data`.`paymentImage` AS `paymentImage`, `form_data`.`date_time_submit` AS `date_time_submit` FROM `form_data` ;

-- --------------------------------------------------------

--
-- Structure for view `display`
--
DROP TABLE IF EXISTS `display`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `display`  AS SELECT `form_data`.`email` AS `email`, `form_data`.`mobile` AS `mobile` FROM `form_data` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `form_data`
--
ALTER TABLE `form_data`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mobile` (`mobile`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `form_data`
--
ALTER TABLE `form_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
