-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 04, 2025 at 09:37 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `easekolar_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookmarks`
--

CREATE TABLE `bookmarks` (
  `bookmark_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `scholarship_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `scholarships`
--

CREATE TABLE `scholarships` (
  `scholarship_id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `eligibility` text DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `website_link` varchar(255) DEFAULT NULL,
  `registration_link` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `scholarships`
--

INSERT INTO `scholarships` (`scholarship_id`, `name`, `description`, `eligibility`, `deadline`, `website_link`, `registration_link`, `created_at`, `updated_at`) VALUES
(1, 'Global STEM Excellence Scholarship', 'Awarded to outstanding STEM students with leadership potential.', 'Undergraduates in STEM with GPA >= 3.5', '2025-12-31', 'https://example.com/stem', 'https://example.com/apply', '2025-10-02 07:37:21', '2025-10-02 07:37:34'),
(2, 'Megawide / USC Architecture Merit Scholarship', 'The merit scholarship will be awarded to deserving Architecture students who demonstrate good academic standing, financial need, and have a grade-weighted average of at least 85% (equivalent to 2.5). Megawide will provide financial support and board review assistance to scholarship recipients beginning 1st semester of Academic Year 2025-2026, with the assistance of the USC Office of Alumni, Scholarships and Job Placement (OAASJP).', 'Applicants must be Architecture students at USC; they must demonstrate good academic standing; they must show financial need; and they must have a grade-weighted average of at least 85% (equivalent to 2.5).', NULL, 'https://usc.edu.ph/megawide-to-provide-full-scholarship-board-review-assistance-to-architecture-students', 'https://usc.edu.ph/megawide-to-provide-full-scholarship-board-review-assistance-to-architecture-students', '2025-10-03 09:00:05', '2025-10-03 09:00:05'),
(3, 'DOST-SEI ASTHRDP Graduate Scholarships (USC)', 'Qualified scholars will receive full school fees, monthly stipend, book allowance, and research grant if they enroll in any of the following graduate programs at the University of San Carlos: M.S. Biology, M.S. Marine Biology, M.S. Environmental Science, M.S. Chemistry, M.S. Physics, M.S. Pharmacy, M.S. Pharmaceutical Science, M.S. Mathematics, Ph.D. Biology, Ph.D. Physics.', 'Applicants must be qualified graduate scholars; must enroll in one of the listed graduate programs at USC; must meet additional requirements as prescribed by USC / ASTHRDP program.', '2025-07-15', 'https://usc.edu.ph/dost-sei-asthrdp-opens-graduate-scholarships-for-1st-semester-of-a-y-2025-2026', 'uscasthrdp@usc.edu.ph', '2025-10-03 09:00:05', '2025-10-03 09:00:05'),
(4, 'Roland H. Goipeng Scholarship Grant (USC Law)', 'The scholarship will provide financial support to junior and senior USC law students in good standing and in financial need, covering the full tuition and other school fees for every semester, with the assistance of the Office of Alumni Affairs, Scholarship and Job Placement (OAASJP).', 'Applicants must be USC law students in their junior or senior years; they must be in good academic standing; they must also have financial need.', NULL, 'https://usc.edu.ph/usc-law-receives-goipeng-scholarship-grant', 'https://usc.edu.ph/usc-law-receives-goipeng-scholarship-grant', '2025-10-03 09:00:05', '2025-10-03 09:00:05'),
(5, 'USC Merit Scholarships to Top SHS Graduates', 'USC Senior High School graduates with the three highest grades in each strand (STEM, HUMSS, AD, ABM) are eligible for merit scholarships: Rank 1 – 100% tuition fee waiver, Rank 2 – 75%, Rank 3 – 50%. Top graduates from other schools receive a 100% tuition fee waiver. To maintain scholarships, GPA of at least 1.7 every semester is required. Scholars must not have a grade of 5.0, NC, or INC. Requirements: completed application form, principal’s certification, extracurricular proof, adherence to rules (no work, no other scholarships, good academic standing).', 'Applicants must be USC SHS graduates among the top three in each strand, or top graduates from other schools; must maintain GPA ≥ 1.7 with no grade of 5.0, NC or INC; must comply with documentation and university regulations.', NULL, 'https://usc.edu.ph/usc-offers-merit-scholarships-to-top-shs-graduates', 'https://usc.edu.ph/usc-offers-merit-scholarships-to-top-shs-graduates', '2025-10-03 09:00:05', '2025-10-03 09:00:05'),
(6, 'CIT University – Non-Academic Scholarship (NAS / Special NAS)', 'Privilege: FREE-ALL. Other components include special non-academic scholarship perks for members of the CIT University Dance Troupe, Ms. Lakambini and CESAFI Muse, student trainers/coaches; athletic scholarship (various sports) with 25% tuition discount up to FREE-ALL; other discount privileges like full-payment discount, sibling discount, etc.', 'Applicants must be a college student in any program; must have at least one semester residency at CIT University or be a Senior High School graduate of CIT; family per capita monthly gross income must not exceed Php 2,500; must have no failing grade; must have good moral character; must not have criminal record, drug addiction, or violations of university rules.', NULL, 'https://cit.edu/scholarships/non-academic-scholarship-nas/', 'https://cit.edu/scholarships/non-academic-scholarship-nas/', '2025-10-03 09:00:05', '2025-10-03 09:00:05');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `course` varchar(100) DEFAULT NULL,
  `gpa` int(11) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `role` enum('student','admin') NOT NULL DEFAULT 'student',
  `preferred_fields` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `full_name` varchar(255) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `address_region` varchar(100) DEFAULT NULL,
  `address_province` varchar(100) DEFAULT NULL,
  `address_city` varchar(100) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `school` varchar(150) DEFAULT NULL,
  `year_level` varchar(50) DEFAULT NULL,
  `strand_or_course` varchar(150) DEFAULT NULL,
  `academic_awards` text DEFAULT NULL,
  `parents_occupation` varchar(150) DEFAULT NULL,
  `parents_education` varchar(150) DEFAULT NULL,
  `household_income_range` varchar(100) DEFAULT NULL,
  `siblings_in_school` int(11) DEFAULT NULL,
  `field_of_interest` varchar(100) DEFAULT NULL,
  `leadership_experience` text DEFAULT NULL,
  `volunteer_work` text DEFAULT NULL,
  `special_skills` text DEFAULT NULL,
  `special_sector_membership` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `course`, `gpa`, `location`, `role`, `preferred_fields`, `createdAt`, `updatedAt`, `full_name`, `birth_date`, `gender`, `address_region`, `address_province`, `address_city`, `contact_number`, `school`, `year_level`, `strand_or_course`, `academic_awards`, `parents_occupation`, `parents_education`, `household_income_range`, `siblings_in_school`, `field_of_interest`, `leadership_experience`, `volunteer_work`, `special_skills`, `special_sector_membership`) VALUES
(1, 'Jane Minimal', 'jane.min@example.com', '$2a$10$Ze9xku5huXBSaeJ1hOczcOhanrwKCDx/t6tppcOhlgQo6WdtG8UNW', NULL, NULL, NULL, 'admin', NULL, '2025-10-02 07:04:42', '2025-10-02 15:26:09', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'Juan Dela Cruz', 'juan.delacruz@example.com', '$2a$10$G9V6AT0uO2kTABY1xf8Z4.Z78Io2wL8Zwqt.7LQY1wrcAnGu3lUN2', 'BS Information Technology', 93, 'Cebu City', 'student', 'IT, Programming, Data Science', '2025-10-03 09:21:59', '2025-10-03 09:35:46', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'Maria Santos', 'maria.santos@example.com', '$2a$10$OQJeNAIMy8H8cCX2gZb78.0J1777u3u/NowRAvJWDQ5cW4DnE0lqu', 'BS Architecture', 91, 'Cebu City', 'student', 'Architecture, Arts', '2025-10-04 07:30:49', '2025-10-04 07:30:49', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookmarks`
--
ALTER TABLE `bookmarks`
  ADD PRIMARY KEY (`bookmark_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `scholarship_id` (`scholarship_id`);

--
-- Indexes for table `scholarships`
--
ALTER TABLE `scholarships`
  ADD PRIMARY KEY (`scholarship_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookmarks`
--
ALTER TABLE `bookmarks`
  MODIFY `bookmark_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `scholarships`
--
ALTER TABLE `scholarships`
  MODIFY `scholarship_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookmarks`
--
ALTER TABLE `bookmarks`
  ADD CONSTRAINT `bookmarks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookmarks_ibfk_2` FOREIGN KEY (`scholarship_id`) REFERENCES `scholarships` (`scholarship_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
