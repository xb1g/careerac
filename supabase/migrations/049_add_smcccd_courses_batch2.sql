-- Migration 049: SMCCCD courses batch 2 - BUS, ART, MUS, BIOL, CHEM, MATH
-- CSM (c0000000-0000-0000-0000-000000000001)
-- Cañada (c0000000-0000-0000-0000-000000000002)
-- Skyline (c0000000-0000-0000-0000-000000000003)

-- =============================================================================
-- CSM BUSINESS (BUS)
-- =============================================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'BUS. 100', 'Introduction to Business', 3, 'CSU/UC transferable introduction to business course'),
('c0000000-0000-0000-0000-000000000001', 'BUS. 101', 'Human Relations At Work', 3, 'CSU transferable human relations course'),
('c0000000-0000-0000-0000-000000000001', 'BUS. 103', 'Business Information Systems', 3, 'CSU/UC transferable business information systems course'),
('c0000000-0000-0000-0000-000000000001', 'BUS. 113', 'Personal Finance', 3, 'CSU/UC transferable personal finance course'),
('c0000000-0000-0000-0000-000000000001', 'BUS. 118', 'Spreadsheets', 3, 'CSU transferable spreadsheets course'),
('c0000000-0000-0000-0000-000000000001', 'BUS. 123', 'Business Statistics', 3, 'CSU/UC transferable business statistics course'),
('c0000000-0000-0000-0000-000000000001', 'BUS. 125', 'International Business', 3, 'CSU/UC transferable international business course'),
('c0000000-0000-0000-0000-000000000001', 'BUS. 127', 'Fundamentals of International Trade', 3, 'CSU transferable international trade course'),
('c0000000-0000-0000-0000-000000000001', 'BUS. 136', 'Business Finance', 3, 'CSU/UC transferable business finance course'),
('c0000000-0000-0000-0000-000000000001', 'BUS. 150', 'Small Business Management', 3, 'CSU transferable small business management course'),
('c0000000-0000-0000-0000-000000000001', 'BUS. 171', 'The Entrepreneurial Mindset', 3, 'CSU transferable entrepreneurship course'),
('c0000000-0000-0000-0000-000000000001', 'BUS. 173', 'Sources of Financing', 3, 'CSU transferable financing course'),
('c0000000-0000-0000-0000-000000000001', 'BUS. 174', 'The Business Plan', 3, 'CSU transferable business plan course'),
('c0000000-0000-0000-0000-000000000001', 'BUS. 176', 'Selling the Idea', 3, 'CSU transferable selling course'),
('c0000000-0000-0000-0000-000000000001', 'BUS. 180', 'Introduction to Marketing', 3, 'CSU transferable marketing course'),
('c0000000-0000-0000-0000-000000000001', 'BUS. 189', 'Fundamentals of Personal Selling', 3, 'CSU transferable personal selling course'),
('c0000000-0000-0000-0000-000000000001', 'BUS. 201', 'Business Law', 3, 'CSU/UC transferable business law course'),
('c0000000-0000-0000-0000-000000000001', 'BUS. 203', 'Intercultural Relations in Global Business', 3, 'CSU/UC transferable intercultural business course'),
('c0000000-0000-0000-0000-000000000001', 'BUS. 205', 'Business Ethics and Social Responsibility', 3, 'CSU/UC transferable business ethics course'),
('c0000000-0000-0000-0000-000000000001', 'BUS. 206', 'Operations and Supply Chain Management', 3, 'CSU transferable supply chain course'),
('c0000000-0000-0000-0000-000000000001', 'BUS. 207', 'Business Analytics Fundamentals', 3, 'CSU/UC transferable business analytics course'),
('c0000000-0000-0000-0000-000000000001', 'BUS. 208', 'Quantitative Business Analysis', 3, 'CSU/UC transferable quantitative analysis course'),
('c0000000-0000-0000-0000-000000000001', 'BUS. 209', 'Data Visualization', 3, 'CSU/UC transferable data visualization course'),
('c0000000-0000-0000-0000-000000000001', 'BUS. 230', 'International Marketing', 3, 'CSU transferable international marketing course'),
('c0000000-0000-0000-0000-000000000001', 'BUS. 232', 'Sales Management', 3, 'CSU transferable sales management course'),
('c0000000-0000-0000-0000-000000000001', 'BUS. 233', 'Social Media Marketing', 3, 'CSU transferable social media marketing course'),
('c0000000-0000-0000-0000-000000000001', 'BUS. 401', 'Business Communications', 3, 'CSU transferable business communications course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- =============================================================================
-- CAÑADA BUSINESS (BUS)
-- =============================================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000002', 'BUS. 100', 'Introduction to Business', 3, 'CSU/UC transferable introduction to business course'),
('c0000000-0000-0000-0000-000000000002', 'BUS. 101', 'Human Relations in the Workplace', 3, 'CSU/UC transferable human relations course'),
('c0000000-0000-0000-0000-000000000002', 'BUS. 103', 'Introduction to Business Information Systems', 3, 'CSU/UC transferable business information systems course'),
('c0000000-0000-0000-0000-000000000002', 'BUS. 113', 'Personal Finance', 3, 'CSU/UC transferable personal finance course'),
('c0000000-0000-0000-0000-000000000002', 'BUS. 125', 'International Business', 3, 'CSU/UC transferable international business course'),
('c0000000-0000-0000-0000-000000000002', 'BUS. 150', 'Entrepreneurship: Small Business Management', 3, 'CSU transferable small business management course'),
('c0000000-0000-0000-0000-000000000002', 'BUS. 161', 'Creativity and Innovation in Entrepreneurship', 3, 'CSU/UC transferable entrepreneurship course'),
('c0000000-0000-0000-0000-000000000002', 'BUS. 180', 'Marketing', 3, 'CSU transferable marketing course'),
('c0000000-0000-0000-0000-000000000002', 'BUS. 193', 'Digital Marketing', 3, 'CSU transferable digital marketing course'),
('c0000000-0000-0000-0000-000000000002', 'BUS. 201', 'Business Law', 3, 'CSU/UC transferable business law course'),
('c0000000-0000-0000-0000-000000000002', 'BUS. 230', 'International Marketing', 3, 'CSU transferable international marketing course'),
('c0000000-0000-0000-0000-000000000002', 'BUS. 233', 'Social Media Marketing', 3, 'CSU transferable social media marketing course'),
('c0000000-0000-0000-0000-000000000002', 'BUS. 401', 'Business Communications', 3, 'CSU transferable business communications course'),
('c0000000-0000-0000-0000-000000000002', 'BUS. 695', 'Independent Study', 0.5, 'CSU independent study')
ON CONFLICT (institution_id, code) DO NOTHING;

-- =============================================================================
-- SKYLINE BUSINESS (BUS)
-- =============================================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000003', 'BUS. 100', 'Introduction to Business', 3, 'CSU/UC transferable introduction to business course'),
('c0000000-0000-0000-0000-000000000003', 'BUS. 101', 'Human Relations at Work', 3, 'CSU transferable human relations course'),
('c0000000-0000-0000-0000-000000000003', 'BUS. 103', 'Introduction to Business Information Systems', 3, 'CSU/UC transferable business information systems course'),
('c0000000-0000-0000-0000-000000000003', 'BUS. 113', 'Personal Finance', 3, 'CSU/UC transferable personal finance course'),
('c0000000-0000-0000-0000-000000000003', 'BUS. 120', 'Mathematical Analysis for Business', 3, 'CSU/UC transferable business math course'),
('c0000000-0000-0000-0000-000000000003', 'BUS. 123', 'Statistics', 3, 'CSU/UC transferable statistics course'),
('c0000000-0000-0000-0000-000000000003', 'BUS. 150', 'Entrepreneurship - Small Business Management', 3, 'CSU transferable small business management course'),
('c0000000-0000-0000-0000-000000000003', 'BUS. 161', 'Creativity and Innovation in Entrepreneurship', 3, 'CSU transferable entrepreneurship course'),
('c0000000-0000-0000-0000-000000000003', 'BUS. 166', 'The Business Plan', 3, 'CSU transferable business plan course'),
('c0000000-0000-0000-0000-000000000003', 'BUS. 180', 'Principles of Marketing', 3, 'CSU transferable marketing course'),
('c0000000-0000-0000-0000-000000000003', 'BUS. 188', 'Consumer Behavior and Interpreting Marketing Dynamics', 3, 'CSU transferable consumer behavior course'),
('c0000000-0000-0000-0000-000000000003', 'BUS. 189', 'Sales and Self Promotion: Fundamentals of Personal Selling', 3, 'CSU transferable personal selling course'),
('c0000000-0000-0000-0000-000000000003', 'BUS. 192', 'Ethnic and Multicultural Marketing', 3, 'CSU transferable multicultural marketing course'),
('c0000000-0000-0000-0000-000000000003', 'BUS. 193', 'Digital Marketing', 3, 'CSU transferable digital marketing course'),
('c0000000-0000-0000-0000-000000000003', 'BUS. 201', 'Business Law', 3, 'CSU/UC transferable business law course'),
('c0000000-0000-0000-0000-000000000003', 'BUS. 391', 'Retail Management', 3, 'CSU transferable retail management course'),
('c0000000-0000-0000-0000-000000000003', 'BUS. 401', 'Business Communications', 3, 'CSU transferable business communications course'),
('c0000000-0000-0000-0000-000000000003', 'BUS. 665', 'Selected Topics in Business', 0.5, 'CSU selected topics in business'),
('c0000000-0000-0000-0000-000000000003', 'BUS. 670', 'Business Work Experience', 1, 'CSU work experience'),
('c0000000-0000-0000-0000-000000000003', 'BUS. 695', 'Independent Study in Business', 0.5, 'CSU independent study in business')
ON CONFLICT (institution_id, code) DO NOTHING;

-- =============================================================================
-- CSM ART
-- =============================================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'ART 101', 'Art and Architecture from the Ancient World to Medieval Times (c. 1400)', 3, 'CSU/UC transferable art history course'),
('c0000000-0000-0000-0000-000000000001', 'ART 102', 'Art of Renaissance and Baroque (c. 1300-1700)', 3, 'CSU/UC transferable art history course'),
('c0000000-0000-0000-0000-000000000001', 'ART 103', 'Art of Europe and America: Neoclassical (c. 1750-Present)', 3, 'CSU/UC transferable art history course'),
('c0000000-0000-0000-0000-000000000001', 'ART 104', 'Modern Art', 3, 'CSU/UC transferable modern art course'),
('c0000000-0000-0000-0000-000000000001', 'ART 105', 'Asian Art and Architecture', 3, 'CSU/UC transferable Asian art course'),
('c0000000-0000-0000-0000-000000000001', 'ART 124', 'Old Masters'' Aesthetics and Techniques', 3, 'CSU/UC transferable art techniques course'),
('c0000000-0000-0000-0000-000000000001', 'ART 129', 'New Masters'' Aesthetics and Techniques', 3, 'CSU/UC transferable art techniques course'),
('c0000000-0000-0000-0000-000000000001', 'ART 200', 'Portfolio Preparation', 3, 'CSU/UC transferable portfolio course'),
('c0000000-0000-0000-0000-000000000001', 'ART 203', 'Plein Air Painting', 3, 'CSU/UC transferable painting course'),
('c0000000-0000-0000-0000-000000000001', 'ART 204', 'Drawing I', 3, 'CSU/UC transferable drawing course'),
('c0000000-0000-0000-0000-000000000001', 'ART 205', 'Drawing II', 3, 'CSU/UC transferable drawing course'),
('c0000000-0000-0000-0000-000000000001', 'ART 206', 'Expressive Figure Drawing and Portraiture', 3, 'CSU/UC transferable figure drawing course'),
('c0000000-0000-0000-0000-000000000001', 'ART 207', 'Life Drawing', 3, 'CSU/UC transferable life drawing course'),
('c0000000-0000-0000-0000-000000000001', 'ART 208', 'Portrait Drawing I', 3, 'CSU/UC transferable portrait drawing course'),
('c0000000-0000-0000-0000-000000000001', 'ART 209', 'Portrait Drawing II', 3, 'CSU/UC transferable portrait drawing course'),
('c0000000-0000-0000-0000-000000000001', 'ART 213', 'Life Drawing II', 3, 'CSU/UC transferable life drawing course'),
('c0000000-0000-0000-0000-000000000001', 'ART 214', 'Color', 3, 'CSU/UC transferable color theory course'),
('c0000000-0000-0000-0000-000000000001', 'ART 215', 'Portraiture III', 3, 'CSU/UC transferable portrait drawing course'),
('c0000000-0000-0000-0000-000000000001', 'ART 216', 'Portraiture IV', 3, 'CSU/UC transferable portrait drawing course'),
('c0000000-0000-0000-0000-000000000001', 'ART 223', 'Oil Painting I', 3, 'CSU/UC transferable oil painting course'),
('c0000000-0000-0000-0000-000000000001', 'ART 224', 'Oil Painting II', 3, 'CSU/UC transferable oil painting course'),
('c0000000-0000-0000-0000-000000000001', 'ART 225', 'Acrylic Painting I', 3, 'CSU/UC transferable acrylic painting course'),
('c0000000-0000-0000-0000-000000000001', 'ART 226', 'Acrylic Painting II', 3, 'CSU/UC transferable acrylic painting course'),
('c0000000-0000-0000-0000-000000000001', 'ART 230', 'Expressive Figure Drawing and Portraiture II', 3, 'CSU/UC transferable figure drawing course'),
('c0000000-0000-0000-0000-000000000001', 'ART 231', 'Watercolor I', 3, 'CSU/UC transferable watercolor course'),
('c0000000-0000-0000-0000-000000000001', 'ART 232', 'Watercolor II', 3, 'CSU/UC transferable watercolor course'),
('c0000000-0000-0000-0000-000000000001', 'ART 233', 'Watercolor III', 3, 'CSU/UC transferable watercolor course'),
('c0000000-0000-0000-0000-000000000001', 'ART 234', 'Printmaking 1', 3, 'CSU/UC transferable printmaking course'),
('c0000000-0000-0000-0000-000000000001', 'ART 243', 'Watercolor IV', 3, 'CSU/UC transferable watercolor course'),
('c0000000-0000-0000-0000-000000000001', 'ART 244', 'Oil Painting III', 3, 'CSU/UC transferable oil painting course'),
('c0000000-0000-0000-0000-000000000001', 'ART 247', 'Oil Painting IV', 3, 'CSU/UC transferable oil painting course'),
('c0000000-0000-0000-0000-000000000001', 'ART 251', 'Acrylic Painting III', 3, 'CSU/UC transferable acrylic painting course'),
('c0000000-0000-0000-0000-000000000001', 'ART 252', 'Acrylic Painting IV', 3, 'CSU/UC transferable acrylic painting course'),
('c0000000-0000-0000-0000-000000000001', 'ART 253', 'Plein Air Painting II', 3, 'CSU/UC transferable painting course'),
('c0000000-0000-0000-0000-000000000001', 'ART 254', 'Plein Air Painting III', 3, 'CSU/UC transferable painting course'),
('c0000000-0000-0000-0000-000000000001', 'ART 255', 'Plein Air Painting IV', 3, 'CSU/UC transferable painting course'),
('c0000000-0000-0000-0000-000000000001', 'ART 301', 'Two-Dimensional Design', 3, 'CSU/UC transferable design course'),
('c0000000-0000-0000-0000-000000000001', 'ART 347', 'The History of Photography (1900- present)', 3, 'CSU/UC transferable photography history course'),
('c0000000-0000-0000-0000-000000000001', 'ART 348', 'Photographic Composition using Handheld Devices', 3, 'CSU/UC transferable photography course'),
('c0000000-0000-0000-0000-000000000001', 'ART 350', 'Visual Perception', 3, 'CSU/UC transferable visual perception course'),
('c0000000-0000-0000-0000-000000000001', 'ART 351', 'Beginning Black and White Photography', 3, 'CSU/UC transferable photography course'),
('c0000000-0000-0000-0000-000000000001', 'ART 352', 'Intermediate Black and White Photography', 3, 'CSU/UC transferable photography course'),
('c0000000-0000-0000-0000-000000000001', 'ART 353', 'Advanced Black and White Photography', 3, 'CSU/UC transferable photography course'),
('c0000000-0000-0000-0000-000000000001', 'ART 360', 'Experimental Photography', 3, 'CSU transferable experimental photography course'),
('c0000000-0000-0000-0000-000000000001', 'ART 381', 'Beginning Digital Photography', 3, 'CSU/UC transferable digital photography course'),
('c0000000-0000-0000-0000-000000000001', 'ART 383', 'Intermediate Digital Photography', 3, 'CSU/UC transferable digital photography course'),
('c0000000-0000-0000-0000-000000000001', 'ART 384', 'Advanced Digital Photography', 3, 'CSU/UC transferable digital photography course'),
('c0000000-0000-0000-0000-000000000001', 'ART 385', 'Master Portfolio - Digital Photography', 3.5, 'CSU/UC transferable portfolio course'),
('c0000000-0000-0000-0000-000000000001', 'ART 391', 'Experimental Photography 1', 3, 'CSU/UC transferable experimental photography course'),
('c0000000-0000-0000-0000-000000000001', 'ART 392', 'Experimental Photography 2', 3, 'CSU/UC transferable experimental photography course'),
('c0000000-0000-0000-0000-000000000001', 'ART 393', 'Experimental Photography 3', 3, 'CSU/UC transferable experimental photography course'),
('c0000000-0000-0000-0000-000000000001', 'ART 394', 'Experimental Photography 4', 3, 'CSU/UC transferable experimental photography course'),
('c0000000-0000-0000-0000-000000000001', 'ART 396', 'Documentary Photography 1', 3, 'CSU/UC transferable documentary photography course'),
('c0000000-0000-0000-0000-000000000001', 'ART 397', 'Documentary Photography 2', 3, 'CSU/UC transferable documentary photography course'),
('c0000000-0000-0000-0000-000000000001', 'ART 398', 'Documentary Photography 3', 3, 'CSU/UC transferable documentary photography course'),
('c0000000-0000-0000-0000-000000000001', 'ART 399', 'Documentary Photography 4', 3, 'CSU/UC transferable documentary photography course'),
('c0000000-0000-0000-0000-000000000001', 'ART 401', 'Three-Dimensional Design', 3, 'CSU/UC transferable 3D design course'),
('c0000000-0000-0000-0000-000000000001', 'ART 405', 'Sculpture I', 3, 'CSU/UC transferable sculpture course'),
('c0000000-0000-0000-0000-000000000001', 'ART 406', 'Sculpture II', 3, 'CSU/UC transferable sculpture course'),
('c0000000-0000-0000-0000-000000000001', 'ART 409', 'Sculpture III Extended Expertise', 3, 'CSU/UC transferable sculpture course'),
('c0000000-0000-0000-0000-000000000001', 'ART 410', 'Sculpture IV Advanced Expression', 3, 'CSU/UC transferable sculpture course'),
('c0000000-0000-0000-0000-000000000001', 'ART 411', 'Ceramics I', 3, 'CSU/UC transferable ceramics course'),
('c0000000-0000-0000-0000-000000000001', 'ART 412', 'Ceramics II', 3, 'CSU/UC transferable ceramics course'),
('c0000000-0000-0000-0000-000000000001', 'ART 417', 'Ceramic Glazing Techniques', 3, 'CSU/UC transferable ceramics course'),
('c0000000-0000-0000-0000-000000000001', 'ART 418', 'Ceramics III', 3, 'CSU/UC transferable ceramics course'),
('c0000000-0000-0000-0000-000000000001', 'ART 806', 'Digital Workshop', 0.5, 'Digital workshop course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- =============================================================================
-- CAÑADA ART
-- =============================================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000002', 'ART 101', 'Ancient, Classical and Medieval Art History', 3, 'CSU/UC transferable art history course'),
('c0000000-0000-0000-0000-000000000002', 'ART 102', 'Late Medieval, Renaissance and Baroque Art History', 3, 'CSU/UC transferable art history course'),
('c0000000-0000-0000-0000-000000000002', 'ART 103', 'History of Art from the Baroque Period to Post-Impressionism', 3, 'CSU/UC transferable art history course'),
('c0000000-0000-0000-0000-000000000002', 'ART 104', 'History of Modern Art', 3, 'CSU/UC transferable modern art course'),
('c0000000-0000-0000-0000-000000000002', 'ART 105', 'Asian Art and Architecture', 3, 'CSU/UC transferable Asian art course'),
('c0000000-0000-0000-0000-000000000002', 'ART 113', 'Great Museums of America', 3, 'CSU/UC transferable museum studies course'),
('c0000000-0000-0000-0000-000000000002', 'ART 114', 'The Art History of Paris', 3, 'CSU/UC transferable art history course'),
('c0000000-0000-0000-0000-000000000002', 'ART 116', 'The Art of Great Britain', 3, 'CSU/UC transferable art history course'),
('c0000000-0000-0000-0000-000000000002', 'ART 118', 'The Art and Architecture of Spain', 3, 'CSU/UC transferable art history course'),
('c0000000-0000-0000-0000-000000000002', 'ART 128', 'Great Museums of California', 3, 'CSU/UC transferable museum studies course'),
('c0000000-0000-0000-0000-000000000002', 'ART 131', 'Art History Goes to the Movies', 3, 'CSU/UC transferable art and film course'),
('c0000000-0000-0000-0000-000000000002', 'ART 204', 'Drawing I', 3, 'CSU/UC transferable drawing course'),
('c0000000-0000-0000-0000-000000000002', 'ART 205', 'Drawing II', 3, 'CSU/UC transferable drawing course'),
('c0000000-0000-0000-0000-000000000002', 'ART 206', 'Figure Drawing and Portraiture', 3, 'CSU/UC transferable figure drawing course'),
('c0000000-0000-0000-0000-000000000002', 'ART 207', 'Life Drawing', 3, 'CSU/UC transferable life drawing course'),
('c0000000-0000-0000-0000-000000000002', 'ART 213', 'Life Drawing II', 3, 'CSU/UC transferable life drawing course'),
('c0000000-0000-0000-0000-000000000002', 'ART 214', 'Color', 3, 'CSU/UC transferable color theory course'),
('c0000000-0000-0000-0000-000000000002', 'ART 221', 'Painting I', 3, 'CSU/UC transferable painting course'),
('c0000000-0000-0000-0000-000000000002', 'ART 222', 'Painting II', 3, 'CSU/UC transferable painting course'),
('c0000000-0000-0000-0000-000000000002', 'ART 229', 'Landscape Painting', 2, 'CSU/UC transferable landscape painting course'),
('c0000000-0000-0000-0000-000000000002', 'ART 231', 'Watercolor I', 3, 'CSU/UC transferable watercolor course'),
('c0000000-0000-0000-0000-000000000002', 'ART 232', 'Watercolor II', 3, 'CSU/UC transferable watercolor course'),
('c0000000-0000-0000-0000-000000000002', 'ART 250', 'The Art History of Rome', 3, 'CSU/UC transferable art history course'),
('c0000000-0000-0000-0000-000000000002', 'ART 301', 'Two-Dimensional Design', 3, 'CSU/UC transferable design course'),
('c0000000-0000-0000-0000-000000000002', 'ART 304', 'Gallery Design and Management', 2, 'CSU transferable gallery course'),
('c0000000-0000-0000-0000-000000000002', 'ART 306', 'Three-Dimensional Design', 3, 'CSU/UC transferable 3D design course'),
('c0000000-0000-0000-0000-000000000002', 'ART 695', 'Independent Study', 0.5, 'CSU independent study')
ON CONFLICT (institution_id, code) DO NOTHING;

-- =============================================================================
-- SKYLINE ART
-- =============================================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000003', 'ART 101', 'History of Western Art I', 3, 'CSU/UC transferable art history course'),
('c0000000-0000-0000-0000-000000000003', 'ART 102', 'History of Western Art II', 3, 'CSU/UC transferable art history course'),
('c0000000-0000-0000-0000-000000000003', 'ART 105', 'Asian Art and Architecture', 3, 'CSU/UC transferable Asian art course'),
('c0000000-0000-0000-0000-000000000003', 'ART 107', 'Art of Our Times', 3, 'CSU/UC transferable modern art course'),
('c0000000-0000-0000-0000-000000000003', 'ART 115', 'Art, Music and Ideas', 3, 'CSU/UC transferable interdisciplinary art course'),
('c0000000-0000-0000-0000-000000000003', 'ART 117', 'Arts of Africa and the African Diaspora', 3, 'CSU/UC transferable African diaspora art course'),
('c0000000-0000-0000-0000-000000000003', 'ART 120', 'Art of the Americas', 3, 'CSU/UC transferable American art course'),
('c0000000-0000-0000-0000-000000000003', 'ART 130', 'Art Appreciation', 3, 'CSU/UC transferable art appreciation course'),
('c0000000-0000-0000-0000-000000000003', 'ART 175', 'Visual Theory and Practice: Ceramic Art', 3, 'CSU/UC transferable ceramics course'),
('c0000000-0000-0000-0000-000000000003', 'ART 204', 'Drawing I', 3, 'CSU/UC transferable drawing course'),
('c0000000-0000-0000-0000-000000000003', 'ART 205', 'Drawing II', 3, 'CSU/UC transferable drawing course'),
('c0000000-0000-0000-0000-000000000003', 'ART 207', 'Life Drawing', 3, 'CSU/UC transferable life drawing course'),
('c0000000-0000-0000-0000-000000000003', 'ART 214', 'Color', 3, 'CSU/UC transferable color theory course'),
('c0000000-0000-0000-0000-000000000003', 'ART 217', 'Intermediate Life Drawing', 3, 'CSU/UC transferable life drawing course'),
('c0000000-0000-0000-0000-000000000003', 'ART 221', 'Painting I', 3, 'CSU/UC transferable painting course'),
('c0000000-0000-0000-0000-000000000003', 'ART 222', 'Painting II', 3, 'CSU/UC transferable painting course'),
('c0000000-0000-0000-0000-000000000003', 'ART 231', 'Watercolor I', 3, 'CSU/UC transferable watercolor course'),
('c0000000-0000-0000-0000-000000000003', 'ART 232', 'Watercolor II', 3, 'CSU/UC transferable watercolor course'),
('c0000000-0000-0000-0000-000000000003', 'ART 234', 'Printmaking I', 3, 'CSU/UC transferable printmaking course'),
('c0000000-0000-0000-0000-000000000003', 'ART 239', 'Printmaking II: Monotype, Monoprint and Mixed Media', 3, 'CSU/UC transferable printmaking course'),
('c0000000-0000-0000-0000-000000000003', 'ART 301', 'Two-Dimensional Design', 3, 'CSU/UC transferable design course'),
('c0000000-0000-0000-0000-000000000003', 'ART 350', 'Visual Theory and Practice: Ceramic Art', 3, 'CSU/UC transferable photography course'),
('c0000000-0000-0000-0000-000000000003', 'ART 351.1', 'Black and White Photography I', 3, 'CSU/UC transferable black and white photography course'),
('c0000000-0000-0000-0000-000000000003', 'ART 351.2', 'Black and White Photography II', 3, 'CSU/UC transferable black and white photography course'),
('c0000000-0000-0000-0000-000000000003', 'ART 351.3', 'Black and White Photography III', 3, 'CSU/UC transferable black and white photography course'),
('c0000000-0000-0000-0000-000000000003', 'ART 351.4', 'Black and White Photography IV', 3, 'CSU/UC transferable black and white photography course'),
('c0000000-0000-0000-0000-000000000003', 'ART 354', 'Digital Photography I', 3, 'CSU/UC transferable digital photography course'),
('c0000000-0000-0000-0000-000000000003', 'ART 355', 'Digital Photography II', 3, 'CSU/UC transferable digital photography course'),
('c0000000-0000-0000-0000-000000000003', 'ART 401', 'Three-Dimensional Design', 3, 'CSU/UC transferable 3D design course'),
('c0000000-0000-0000-0000-000000000003', 'ART 405', 'Sculpture I', 3, 'CSU/UC transferable sculpture course'),
('c0000000-0000-0000-0000-000000000003', 'ART 406', 'Sculpture II', 3, 'CSU/UC transferable sculpture course'),
('c0000000-0000-0000-0000-000000000003', 'ART 411', 'Ceramics I', 3, 'CSU/UC transferable ceramics course'),
('c0000000-0000-0000-0000-000000000003', 'ART 412', 'Ceramics II', 3, 'CSU/UC transferable ceramics course'),
('c0000000-0000-0000-0000-000000000003', 'ART 417', 'Ceramic Glazing Techniques', 3, 'CSU/UC transferable ceramics course'),
('c0000000-0000-0000-0000-000000000003', 'ART 418', 'Ceramics III', 3, 'CSU/UC transferable ceramics course'),
('c0000000-0000-0000-0000-000000000003', 'ART 430', 'Introduction to Digital Art', 3, 'CSU/UC transferable digital art course'),
('c0000000-0000-0000-0000-000000000003', 'ART 440', 'Introduction to Web Design', 3, 'CSU/UC transferable web design course'),
('c0000000-0000-0000-0000-000000000003', 'ART 479', 'Typography', 3, 'CSU/UC transferable typography course'),
('c0000000-0000-0000-0000-000000000003', 'ART 665', 'Special Topics in Art', 0.5, 'CSU special topics in art'),
('c0000000-0000-0000-0000-000000000003', 'ART 667', 'Special Topics in Art', 0.5, 'CSU special topics in art'),
('c0000000-0000-0000-0000-000000000003', 'ART 695', 'Independent Study in Art', 0.5, 'CSU independent study in art')
ON CONFLICT (institution_id, code) DO NOTHING;

-- =============================================================================
-- CSM MUSIC (MUS)
-- =============================================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'MUS. 100', 'Fundamentals of Music', 3, 'CSU/UC transferable music fundamentals course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 111', 'Musicianship I', 1, 'CSU/UC transferable musicianship course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 112', 'Musicianship II', 1, 'CSU/UC transferable musicianship course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 113', 'Musicianship III', 1, 'CSU/UC transferable musicianship course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 114', 'Musicianship IV', 1, 'CSU/UC transferable musicianship course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 120', 'Songwriting', 3, 'CSU/UC transferable songwriting course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 124', 'Jazz Improvisation I', 2, 'CSU/UC transferable jazz improvisation course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 125', 'Jazz Improvisation II', 2, 'CSU/UC transferable jazz improvisation course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 130', 'Songwriting II', 3, 'CSU/UC transferable songwriting course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 131', 'Harmony I', 3, 'CSU/UC transferable music theory course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 132', 'Harmony II', 3, 'CSU/UC transferable music theory course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 133', 'Harmony III', 3, 'CSU/UC transferable music theory course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 134', 'Harmony IV', 3, 'CSU/UC transferable music theory course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 202', 'Music Appreciation', 3, 'CSU/UC transferable music appreciation course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 210', 'From Blues to Hip Hop: A History of American Popular Music', 3, 'CSU/UC transferable American music history course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 222', 'Live Sound and Streaming', 3, 'CSU/UC transferable live sound course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 231', 'Afro-Latin Percussion Ensemble I', 2, 'CSU/UC transferable percussion ensemble course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 232', 'Afro-Latin Percussion Ensemble II', 2, 'CSU/UC transferable percussion ensemble course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 233', 'Afro-Latin Percussion Ensemble III', 2, 'CSU/UC transferable percussion ensemble course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 234', 'Afro-Latin Percussion Ensemble IV', 2, 'CSU/UC transferable percussion ensemble course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 250', 'World Music', 3, 'CSU/UC transferable world music course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 275', 'History of Jazz', 3, 'CSU/UC transferable jazz history course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 280', 'History of Electronic Music', 3, 'CSU/UC transferable electronic music history course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 286', 'Music Business', 3, 'CSU transferable music business course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 289', 'Recording for Musical Applications', 3, 'CSU/UC transferable recording course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 290', 'Electronic Music I', 3, 'CSU/UC transferable electronic music course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 291', 'Electronic Music II', 3, 'CSU/UC transferable electronic music course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 292', 'Sound Creation: Sampling and Synthesis', 3, 'CSU/UC transferable sound design course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 293', 'Audio for Visual Media', 3, 'CSU/UC transferable audio for media course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 296', 'Electronic Music Composition Portfolio I', 1.5, 'CSU/UC transferable composition course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 297', 'Electronic Music Composition Portfolio II', 1.5, 'CSU/UC transferable composition course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 298', 'New Interfaces for Making Music', 4, 'CSU transferable new interfaces course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 301', 'Piano I', 2, 'CSU/UC transferable piano course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 302', 'Piano II', 2, 'CSU/UC transferable piano course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 303', 'Piano III', 2, 'CSU/UC transferable piano course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 304', 'Piano IV', 2, 'CSU/UC transferable piano course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 314', 'Piano Literature & Performance - The Baroque Era', 2, 'CSU/UC transferable piano literature course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 315', 'Piano Literature & Performance: The Classical Era', 2, 'CSU/UC transferable piano literature course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 316', 'Piano Literature & Performance: The Romantic Era', 2, 'CSU/UC transferable piano literature course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 317', 'Piano Literature & Performance: The 20th Century & Beyond', 2, 'CSU/UC transferable piano literature course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 371', 'Guitar I', 2, 'CSU/UC transferable guitar course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 372', 'Guitar II', 2, 'CSU/UC transferable guitar course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 373', 'Guitar III', 2, 'CSU/UC transferable guitar course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 374', 'Guitar IV', 2, 'CSU/UC transferable guitar course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 389', 'Recording for Musical Applications II', 3, 'CSU/UC transferable recording course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 398', 'New Interfaces for Making Music II', 4, 'CSU/UC transferable new interfaces course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 401', 'Voice I', 2, 'CSU/UC transferable voice course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 402', 'Voice II', 2, 'CSU/UC transferable voice course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 403', 'Voice III', 2, 'CSU/UC transferable voice course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 404', 'Voice IV', 2, 'CSU/UC transferable voice course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 423', 'Small Ensembles', 2, 'CSU/UC transferable ensemble course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 424', 'Small Jazz Ensembles', 2, 'CSU/UC transferable jazz ensemble course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 425', 'Contemporary Jazz Combo', 2, 'CSU/UC transferable jazz combo course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 429', 'Wind Ensemble', 1, 'CSU/UC transferable wind ensemble course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 430', 'Symphonic Band', 1, 'CSU/UC transferable symphonic band course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 452', 'Repertory Jazz Band', 1, 'CSU/UC transferable jazz band course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 454', 'Jazz Workshop Big Band', 1, 'CSU/UC transferable big band course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 470', 'Concert Choir', 1, 'CSU/UC transferable choir course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 501', 'Studio Lessons I (Applied Music I)', 1, 'CSU/UC transferable applied music course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 502', 'Studio Lessons II (Applied Music II)', 1, 'CSU/UC transferable applied music course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 503', 'Studio Lessons III (Applied Music III)', 1, 'CSU/UC transferable applied music course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 504', 'Studio Lessons IV (Applied Music IV)', 1, 'CSU/UC transferable applied music course'),
('c0000000-0000-0000-0000-000000000001', 'MUS. 884', 'Review of Fundamentals', 0.5, 'Music fundamentals review course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- =============================================================================
-- CAÑADA MUSIC (MUS)
-- =============================================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000002', 'MUS. 100', 'Fundamentals of Music', 3, 'CSU/UC transferable music fundamentals course'),
('c0000000-0000-0000-0000-000000000002', 'MUS. 120', 'Songwriting Workshop I', 3, 'CSU transferable songwriting course'),
('c0000000-0000-0000-0000-000000000002', 'MUS. 202', 'Music Appreciation', 3, 'CSU/UC transferable music appreciation course'),
('c0000000-0000-0000-0000-000000000002', 'MUS. 210', 'Histories of Popular Music and Rock', 3, 'CSU/UC transferable popular music history course'),
('c0000000-0000-0000-0000-000000000002', 'MUS. 215', 'Music, Culture and History', 3, 'CSU/UC transferable music and culture course'),
('c0000000-0000-0000-0000-000000000002', 'MUS. 240', 'Latin American Music', 3, 'CSU/UC transferable Latin American music course'),
('c0000000-0000-0000-0000-000000000002', 'MUS. 250', 'World Music', 3, 'CSU/UC transferable world music course'),
('c0000000-0000-0000-0000-000000000002', 'MUS. 275', 'History of Jazz', 3, 'CSU/UC transferable jazz history course'),
('c0000000-0000-0000-0000-000000000002', 'MUS. 301', 'Piano I', 2, 'CSU/UC transferable piano course'),
('c0000000-0000-0000-0000-000000000002', 'MUS. 302', 'Piano II', 2, 'CSU/UC transferable piano course'),
('c0000000-0000-0000-0000-000000000002', 'MUS. 303', 'Piano III', 2, 'CSU/UC transferable piano course'),
('c0000000-0000-0000-0000-000000000002', 'MUS. 304', 'Piano IV', 2, 'CSU/UC transferable piano course'),
('c0000000-0000-0000-0000-000000000002', 'MUS. 371', 'Guitar I', 2, 'CSU/UC transferable guitar course'),
('c0000000-0000-0000-0000-000000000002', 'MUS. 372', 'Guitar II', 2, 'CSU/UC transferable guitar course'),
('c0000000-0000-0000-0000-000000000002', 'MUS. 373', 'Guitar III', 2, 'CSU/UC transferable guitar course'),
('c0000000-0000-0000-0000-000000000002', 'MUS. 374', 'Guitar IV', 2, 'CSU/UC transferable guitar course'),
('c0000000-0000-0000-0000-000000000002', 'MUS. 695', 'Independent Study', 0.5, 'CSU independent study')
ON CONFLICT (institution_id, code) DO NOTHING;

-- =============================================================================
-- SKYLINE MUSIC (MUS)
-- =============================================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000003', 'MUS. 100', 'Fundamentals of Music', 3, 'CSU/UC transferable music fundamentals course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 105', 'Music Theory I', 3, 'CSU/UC transferable music theory course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 106', 'Music Theory II', 3, 'CSU/UC transferable music theory course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 107', 'Music Theory III', 3, 'CSU/UC transferable music theory course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 108', 'Music Theory IV', 3, 'CSU/UC transferable music theory course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 111', 'Musicianship I', 1, 'CSU/UC transferable musicianship course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 112', 'Musicianship II', 1, 'CSU/UC transferable musicianship course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 113', 'Musicianship III', 1, 'CSU/UC transferable musicianship course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 114', 'Musicianship IV', 1, 'CSU/UC transferable musicianship course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 115', 'Music, Art and Ideas', 3, 'CSU/UC transferable interdisciplinary music course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 202', 'Music Appreciation', 3, 'CSU/UC transferable music appreciation course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 205', 'Piano for General Education', 3, 'CSU/UC transferable piano course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 206', 'Contemporary Singing Styles: History, Theory, and Practice', 3, 'CSU/UC transferable vocal styles course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 240', 'Latin American Music', 3, 'CSU/UC transferable Latin American music course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 250', 'World Music', 3, 'CSU/UC transferable world music course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 275', 'History of Jazz', 3, 'CSU/UC transferable jazz history course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 277', 'African American Music', 3, 'CSU/UC transferable African American music course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 286', 'Music Business', 3, 'CSU transferable music business course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 294', 'Introduction to Music Technology', 3, 'CSU/UC transferable music technology course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 299', 'Electronic Music Production', 3, 'CSU/UC transferable electronic music production course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 301', 'Piano I', 2, 'CSU/UC transferable piano course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 302', 'Piano II', 2, 'CSU/UC transferable piano course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 303', 'Piano III', 2, 'CSU/UC transferable piano course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 304', 'Piano IV', 2, 'CSU/UC transferable piano course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 355', 'Violin/Viola I', 2, 'CSU/UC transferable violin/viola course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 356', 'Violin/Viola II', 2, 'CSU/UC transferable violin/viola course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 357', 'Violin/Viola III', 2, 'CSU/UC transferable violin/viola course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 358', 'Violin/Viola IV', 2, 'CSU/UC transferable violin/viola course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 371', 'Guitar I', 2, 'CSU/UC transferable guitar course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 372', 'Guitar II', 2, 'CSU/UC transferable guitar course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 373', 'Guitar III', 2, 'CSU/UC transferable guitar course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 374', 'Guitar IV', 2, 'CSU/UC transferable guitar course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 383.1', 'Guitar Ensemble I', 1, 'CSU/UC transferable guitar ensemble course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 383.2', 'Guitar Ensemble II', 1, 'CSU/UC transferable guitar ensemble course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 383.3', 'Guitar Ensemble III', 1, 'CSU/UC transferable guitar ensemble course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 383.4', 'Guitar Ensemble IV', 1, 'CSU/UC transferable guitar ensemble course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 401', 'Voice I', 2, 'CSU/UC transferable voice course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 402', 'Voice II', 2, 'CSU/UC transferable voice course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 403', 'Voice III', 2, 'CSU/UC transferable voice course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 404', 'Voice IV', 2, 'CSU/UC transferable voice course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 410.1', 'Vocal Ensemble for the Musical Theater Production I', 1, 'CSU/UC transferable vocal ensemble course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 410.2', 'Vocal Ensemble for the Musical Theater Production II', 1, 'CSU/UC transferable vocal ensemble course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 410.3', 'Vocal Ensemble for the Musical Theater Production III', 1, 'CSU/UC transferable vocal ensemble course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 410.4', 'Vocal Ensemble for the Musical Theater Production IV', 1, 'CSU/UC transferable vocal ensemble course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 420.1', 'Orchestra for the Musical Theater Production I', 1, 'CSU/UC transferable orchestra course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 420.2', 'Orchestra for the Musical Theater Production II', 1, 'CSU/UC transferable orchestra course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 420.3', 'Orchestra for the Musical Theater Production III', 1, 'CSU/UC transferable orchestra course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 420.4', 'Orchestra for the Musical Theater Production IV', 1, 'CSU/UC transferable orchestra course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 430.1', 'Concert Band I', 1, 'CSU/UC transferable concert band course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 430.2', 'Concert Band II', 1, 'CSU/UC transferable concert band course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 430.3', 'Concert Band III', 1, 'CSU/UC transferable concert band course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 430.4', 'Concert Band IV', 1, 'CSU/UC transferable concert band course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 450.1', 'Jazz Band I', 1, 'CSU/UC transferable jazz band course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 450.2', 'Jazz Band II', 1, 'CSU/UC transferable jazz band course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 450.3', 'Jazz Band III', 1, 'CSU/UC transferable jazz band course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 450.4', 'Jazz Band IV', 1, 'CSU/UC transferable jazz band course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 456.1', 'Latin Music Ensemble I', 1, 'CSU/UC transferable Latin music ensemble course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 456.2', 'Latin Music Ensemble II', 1, 'CSU/UC transferable Latin music ensemble course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 456.3', 'Latin Music Ensemble III', 1, 'CSU/UC transferable Latin music ensemble course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 456.4', 'Latin Music Ensemble IV', 1, 'CSU/UC transferable Latin music ensemble course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 470.1', 'Concert Choir I', 1, 'CSU/UC transferable concert choir course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 470.2', 'Concert Choir II', 1, 'CSU/UC transferable concert choir course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 470.3', 'Concert Choir III', 1, 'CSU/UC transferable concert choir course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 470.4', 'Concert Choir IV', 1, 'CSU/UC transferable concert choir course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 485.1', 'Vocal Jazz Ensemble I', 1, 'CSU/UC transferable vocal jazz ensemble course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 485.2', 'Vocal Jazz Ensemble II', 1, 'CSU/UC transferable vocal jazz ensemble course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 485.3', 'Vocal Jazz Ensemble III', 1, 'CSU/UC transferable vocal jazz ensemble course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 485.4', 'Vocal Jazz Ensemble IV', 1, 'CSU/UC transferable vocal jazz ensemble course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 501', 'Applied Music Lessons I', 1, 'CSU/UC transferable applied music course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 502', 'Applied Music Lessons II', 1, 'CSU/UC transferable applied music course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 503', 'Applied Music Lessons III', 1, 'CSU/UC transferable applied music course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 504', 'Applied Music Lessons IV', 1, 'CSU/UC transferable applied music course'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 667', 'Special Topics in Music Performance', 1, 'CSU special topics in music'),
('c0000000-0000-0000-0000-000000000003', 'MUS. 695', 'Independent Study in Music', 0.5, 'CSU independent study in music')
ON CONFLICT (institution_id, code) DO NOTHING;

-- =============================================================================
-- CSM BIOLOGY (BIOL)
-- =============================================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'BIOL 100', 'Introduction to the Life Sciences', 3, 'CSU/UC transferable life sciences course'),
('c0000000-0000-0000-0000-000000000001', 'BIOL 102', 'Environmental Science and Conservation', 3, 'CSU/UC transferable environmental science course'),
('c0000000-0000-0000-0000-000000000001', 'BIOL 110', 'General Principles of Biology', 4, 'CSU/UC transferable general biology course'),
('c0000000-0000-0000-0000-000000000001', 'BIOL 121', 'Immunoassays Workshop: Techniques and Applications', 1, 'CSU transferable biotechnology workshop'),
('c0000000-0000-0000-0000-000000000001', 'BIOL 122', 'Seminar in Immunology and Applications in Biotechnology', 1, 'CSU transferable biotechnology seminar'),
('c0000000-0000-0000-0000-000000000001', 'BIOL 123', 'Biotechnology Workshop: Techniques and Applications of the Polymerase Chain Reaction', 1, 'CSU transferable biotechnology workshop'),
('c0000000-0000-0000-0000-000000000001', 'BIOL 124', 'Seminar in DNA and Applications in Biotechnology', 1, 'CSU transferable biotechnology seminar'),
('c0000000-0000-0000-0000-000000000001', 'BIOL 129', 'Biotechnology: Research and Industrial Applications', 3, 'CSU/UC transferable biotechnology course'),
('c0000000-0000-0000-0000-000000000001', 'BIOL 130', 'Human Biology', 3, 'CSU/UC transferable human biology course'),
('c0000000-0000-0000-0000-000000000001', 'BIOL 132', 'Human Biology Laboratory', 1, 'CSU/UC transferable human biology lab'),
('c0000000-0000-0000-0000-000000000001', 'BIOL 145', 'Plants, People, and Environment', 3, 'CSU/UC transferable plant biology course'),
('c0000000-0000-0000-0000-000000000001', 'BIOL 184', 'Wildlife Biology', 3, 'CSU/UC transferable wildlife biology course'),
('c0000000-0000-0000-0000-000000000001', 'BIOL 195', 'Biology Field Laboratory', 1, 'CSU/UC transferable field biology lab'),
('c0000000-0000-0000-0000-000000000001', 'BIOL 210', 'General Zoology', 5, 'CSU/UC transferable zoology course'),
('c0000000-0000-0000-0000-000000000001', 'BIOL 211', 'Zoology', 4, 'CSU/UC transferable zoology course'),
('c0000000-0000-0000-0000-000000000001', 'BIOL 220', 'General Botany', 5, 'CSU/UC transferable botany course'),
('c0000000-0000-0000-0000-000000000001', 'BIOL 221', 'Botany', 4, 'CSU/UC transferable botany course'),
('c0000000-0000-0000-0000-000000000001', 'BIOL 230', 'Introductory Cell Biology', 4, 'CSU/UC transferable cell biology course'),
('c0000000-0000-0000-0000-000000000001', 'BIOL 240', 'General Microbiology', 4, 'CSU/UC transferable microbiology course'),
('c0000000-0000-0000-0000-000000000001', 'BIOL 250', 'Human Anatomy', 4, 'CSU/UC transferable human anatomy course'),
('c0000000-0000-0000-0000-000000000001', 'BIOL 260', 'Human Physiology', 5, 'CSU/UC transferable human physiology course'),
('c0000000-0000-0000-0000-000000000001', 'BIOL 310', 'Nutrition', 3, 'CSU/UC transferable nutrition course'),
('c0000000-0000-0000-0000-000000000001', 'BIOL 311', 'Sports Nutrition', 3, 'CSU/UC transferable sports nutrition course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- =============================================================================
-- CAÑADA BIOLOGY (BIOL)
-- =============================================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000002', 'BIOL 100', 'Introduction to the Life Sciences', 3, 'CSU/UC transferable life sciences course'),
('c0000000-0000-0000-0000-000000000002', 'BIOL 110', 'Principles Of Biology', 4, 'CSU/UC transferable general biology course'),
('c0000000-0000-0000-0000-000000000002', 'BIOL 130', 'Human Biology', 3, 'CSU/UC transferable human biology course'),
('c0000000-0000-0000-0000-000000000002', 'BIOL 132', 'Human Biology Laboratory', 1, 'CSU/UC transferable human biology lab'),
('c0000000-0000-0000-0000-000000000002', 'BIOL 133', 'Emerging Infectious Diseases', 3, 'CSU/UC transferable infectious disease course'),
('c0000000-0000-0000-0000-000000000002', 'BIOL 225', 'Biology of Organisms', 5, 'CSU/UC transferable organismal biology course'),
('c0000000-0000-0000-0000-000000000002', 'BIOL 230', 'Cell and Molecular Biology', 5, 'CSU/UC transferable cell and molecular biology course'),
('c0000000-0000-0000-0000-000000000002', 'BIOL 240', 'General Microbiology', 4, 'CSU/UC transferable microbiology course'),
('c0000000-0000-0000-0000-000000000002', 'BIOL 250', 'Human Anatomy', 4, 'CSU/UC transferable human anatomy course'),
('c0000000-0000-0000-0000-000000000002', 'BIOL 260', 'Human Physiology', 5, 'CSU/UC transferable human physiology course'),
('c0000000-0000-0000-0000-000000000002', 'BIOL 310', 'Nutrition', 3, 'CSU/UC transferable nutrition course'),
('c0000000-0000-0000-0000-000000000002', 'BIOL 695', 'Independent Study', 0.5, 'CSU independent study')
ON CONFLICT (institution_id, code) DO NOTHING;

-- =============================================================================
-- SKYLINE BIOLOGY (BIOL)
-- =============================================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000003', 'BIOL 101', 'Our Biological World', 4, 'CSU/UC transferable biology course'),
('c0000000-0000-0000-0000-000000000003', 'BIOL 110', 'Principles of Biology', 4, 'CSU/UC transferable general biology course'),
('c0000000-0000-0000-0000-000000000003', 'BIOL 111', 'Natural History of California', 4, 'CSU/UC transferable natural history course'),
('c0000000-0000-0000-0000-000000000003', 'BIOL 130', 'Human Biology', 3, 'CSU/UC transferable human biology course'),
('c0000000-0000-0000-0000-000000000003', 'BIOL 140', 'Animals, People, and Environment', 3, 'CSU/UC transferable animal biology course'),
('c0000000-0000-0000-0000-000000000003', 'BIOL 145', 'Plants, People & Environment', 3, 'CSU/UC transferable plant biology course'),
('c0000000-0000-0000-0000-000000000003', 'BIOL 150', 'Introduction to Marine Biology', 3, 'CSU/UC transferable marine biology course'),
('c0000000-0000-0000-0000-000000000003', 'BIOL 170', 'Principles of Applied Bioscience', 3, 'CSU/UC transferable bioscience course'),
('c0000000-0000-0000-0000-000000000003', 'BIOL 171', 'Laboratory Principles of Applied Bioscience', 1, 'CSU/UC transferable bioscience lab'),
('c0000000-0000-0000-0000-000000000003', 'BIOL 215', 'Organismal Biology: Core I', 5, 'CSU/UC transferable organismal biology course'),
('c0000000-0000-0000-0000-000000000003', 'BIOL 230', 'Introduction to Cell Biology: Core II', 5, 'CSU/UC transferable cell biology course'),
('c0000000-0000-0000-0000-000000000003', 'BIOL 240', 'General Microbiology', 4, 'CSU/UC transferable microbiology course'),
('c0000000-0000-0000-0000-000000000003', 'BIOL 250', 'Human Anatomy', 4, 'CSU/UC transferable human anatomy course'),
('c0000000-0000-0000-0000-000000000003', 'BIOL 260', 'Human Physiology', 5, 'CSU/UC transferable human physiology course'),
('c0000000-0000-0000-0000-000000000003', 'BIOL 310', 'Nutrition', 3, 'CSU/UC transferable nutrition course'),
('c0000000-0000-0000-0000-000000000003', 'BIOL 426', 'Genetic Engineering', 1, 'CSU transferable genetic engineering course'),
('c0000000-0000-0000-0000-000000000003', 'BIOL 430', 'Introduction to Immunology', 1, 'CSU transferable immunology course'),
('c0000000-0000-0000-0000-000000000003', 'BIOL 665', 'Selected Topics in Biology', 0.5, 'CSU selected topics in biology'),
('c0000000-0000-0000-0000-000000000003', 'BIOL 695', 'Independent Study in Biology', 0.5, 'CSU independent study in biology')
ON CONFLICT (institution_id, code) DO NOTHING;

-- =============================================================================
-- CSM CHEMISTRY (CHEM)
-- =============================================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'CHEM 192', 'Elementary Chemistry', 4, 'CSU/UC transferable elementary chemistry course'),
('c0000000-0000-0000-0000-000000000001', 'CHEM 210', 'General Chemistry I', 5, 'CSU/UC transferable general chemistry I course'),
('c0000000-0000-0000-0000-000000000001', 'CHEM 220', 'General Chemistry II', 5, 'CSU/UC transferable general chemistry II course'),
('c0000000-0000-0000-0000-000000000001', 'CHEM 231', 'Organic Chemistry I', 5, 'CSU/UC transferable organic chemistry I course'),
('c0000000-0000-0000-0000-000000000001', 'CHEM 232', 'Organic Chemistry II', 5, 'CSU/UC transferable organic chemistry II course'),
('c0000000-0000-0000-0000-000000000001', 'CHEM 410', 'Health Science Chemistry I', 4, 'CSU/UC transferable health science chemistry course'),
('c0000000-0000-0000-0000-000000000001', 'CHEM 420', 'Health Science Chemistry II', 4, 'CSU/UC transferable health science chemistry course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- =============================================================================
-- CAÑADA CHEMISTRY (CHEM)
-- =============================================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000002', 'CHEM 114', 'Survey of Chemistry and Physics', 4, 'CSU/UC transferable survey chemistry course'),
('c0000000-0000-0000-0000-000000000002', 'CHEM 192', 'Elementary Chemistry', 4, 'CSU/UC transferable elementary chemistry course'),
('c0000000-0000-0000-0000-000000000002', 'CHEM 210', 'General Chemistry I', 5, 'CSU/UC transferable general chemistry I course'),
('c0000000-0000-0000-0000-000000000002', 'CHEM 220', 'General Chemistry II', 5, 'CSU/UC transferable general chemistry II course'),
('c0000000-0000-0000-0000-000000000002', 'CHEM 231', 'Organic Chemistry I', 5, 'CSU/UC transferable organic chemistry I course'),
('c0000000-0000-0000-0000-000000000002', 'CHEM 232', 'Organic Chemistry II', 5, 'CSU/UC transferable organic chemistry II course'),
('c0000000-0000-0000-0000-000000000002', 'CHEM 410', 'Chemistry for Health Sciences', 4, 'CSU/UC transferable health science chemistry course'),
('c0000000-0000-0000-0000-000000000002', 'CHEM 695', 'Independent Study', 0.5, 'CSU independent study')
ON CONFLICT (institution_id, code) DO NOTHING;

-- =============================================================================
-- SKYLINE CHEMISTRY (CHEM)
-- =============================================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000003', 'CHEM 112', 'Chemistry in Action', 4, 'CSU/UC transferable chemistry course'),
('c0000000-0000-0000-0000-000000000003', 'CHEM 114', 'Survey of Chemistry and Physics', 4, 'CSU/UC transferable survey chemistry course'),
('c0000000-0000-0000-0000-000000000003', 'CHEM 192', 'Introductory Chemistry', 4, 'CSU/UC transferable introductory chemistry course'),
('c0000000-0000-0000-0000-000000000003', 'CHEM 210', 'General Chemistry I', 5, 'CSU/UC transferable general chemistry I course'),
('c0000000-0000-0000-0000-000000000003', 'CHEM 220', 'General Chemistry II', 5, 'CSU/UC transferable general chemistry II course'),
('c0000000-0000-0000-0000-000000000003', 'CHEM 234', 'Organic Chemistry I', 3, 'CSU/UC transferable organic chemistry I course'),
('c0000000-0000-0000-0000-000000000003', 'CHEM 235', 'Organic Chemistry II', 3, 'CSU/UC transferable organic chemistry II course'),
('c0000000-0000-0000-0000-000000000003', 'CHEM 237', 'Organic Chemistry Lab I', 2, 'CSU/UC transferable organic chemistry lab course'),
('c0000000-0000-0000-0000-000000000003', 'CHEM 238', 'Organic Chemistry Lab II', 2, 'CSU/UC transferable organic chemistry lab course'),
('c0000000-0000-0000-0000-000000000003', 'CHEM 410', 'Chemistry for Health Sciences', 4, 'CSU/UC transferable health science chemistry course')
ON CONFLICT (institution_id, code) DO NOTHING;

-- =============================================================================
-- CSM MATHEMATICS (MATH)
-- =============================================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'MATH 125', 'Elementary Finite Mathematics', 3, 'CSU/UC transferable finite mathematics course'),
('c0000000-0000-0000-0000-000000000001', 'MATH 130', 'Analytical Trigonometry', 4, 'CSU transferable trigonometry course'),
('c0000000-0000-0000-0000-000000000001', 'MATH 145', 'Liberal Arts Mathematics', 3, 'CSU/UC transferable liberal arts math course'),
('c0000000-0000-0000-0000-000000000001', 'MATH 221', 'Preparation for (B)STEM Math', 4, 'CSU/UC transferable preparation for STEM math course'),
('c0000000-0000-0000-0000-000000000001', 'MATH 222', 'Precalculus', 5, 'CSU/UC transferable precalculus course'),
('c0000000-0000-0000-0000-000000000001', 'MATH 225', 'Path to Calculus', 6, 'CSU/UC transferable path to calculus course'),
('c0000000-0000-0000-0000-000000000001', 'MATH 241', 'Applied Calculus I', 5, 'CSU/UC transferable applied calculus I course'),
('c0000000-0000-0000-0000-000000000001', 'MATH 242', 'Applied Calculus II', 3, 'CSU/UC transferable applied calculus II course'),
('c0000000-0000-0000-0000-000000000001', 'MATH 243', 'Applied Calculus II with Trigonometry', 4, 'CSU/UC transferable applied calculus with trigonometry course'),
('c0000000-0000-0000-0000-000000000001', 'MATH 251', 'Calculus with Analytic Geometry I', 5, 'CSU/UC transferable calculus I course'),
('c0000000-0000-0000-0000-000000000001', 'MATH 252', 'Calculus with Analytic Geometry II', 5, 'CSU/UC transferable calculus II course'),
('c0000000-0000-0000-0000-000000000001', 'MATH 253', 'Calculus with Analytic Geometry III', 5, 'CSU/UC transferable calculus III course'),
('c0000000-0000-0000-0000-000000000001', 'MATH 268', 'Discrete Mathematics', 4, 'CSU/UC transferable discrete mathematics course'),
('c0000000-0000-0000-0000-000000000001', 'MATH 270', 'Linear Algebra', 3, 'CSU/UC transferable linear algebra course'),
('c0000000-0000-0000-0000-000000000001', 'MATH 275', 'Ordinary Differential Equations', 3, 'CSU/UC transferable differential equations course'),
('c0000000-0000-0000-0000-000000000001', 'MATH 280', 'Proofwriting', 4, 'CSU/UC transferable proofwriting course'),
('c0000000-0000-0000-0000-000000000001', 'MATH 825', 'Just-In-Time Support for Path to Calculus', 2, 'Support course for path to calculus'),
('c0000000-0000-0000-0000-000000000001', 'MATH 830', 'Just-In-Time Support for Analytical Trigonometry', 1, 'Support course for trigonometry'),
('c0000000-0000-0000-0000-000000000001', 'MATH 841', 'Just-In-Time Support for Applied Calculus I', 1, 'Support course for applied calculus I'),
('c0000000-0000-0000-0000-000000000001', 'MATH 851', 'Just in time support for Calculus I', 2, 'Support course for calculus I')
ON CONFLICT (institution_id, code) DO NOTHING;

-- =============================================================================
-- CAÑADA MATHEMATICS (MATH)
-- =============================================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000002', 'MATH 120', 'Intermediate Algebra', 5, 'Non-transferable intermediate algebra course'),
('c0000000-0000-0000-0000-000000000002', 'MATH 125', 'Elementary Finite Mathematics', 3, 'CSU/UC transferable finite mathematics course'),
('c0000000-0000-0000-0000-000000000002', 'MATH 130', 'Analytical Trigonometry', 4, 'CSU transferable trigonometry course'),
('c0000000-0000-0000-0000-000000000002', 'MATH 145', 'Liberal Arts Mathematics', 3, 'CSU/UC transferable liberal arts math course'),
('c0000000-0000-0000-0000-000000000002', 'MATH 150', 'Mathematics for Elementary School Teachers', 3, 'CSU/UC transferable elementary education math course'),
('c0000000-0000-0000-0000-000000000002', 'MATH 225', 'Path to Calculus', 6, 'CSU/UC transferable path to calculus course'),
('c0000000-0000-0000-0000-000000000002', 'MATH 241', 'Business Calculus I', 5, 'CSU/UC transferable business calculus course'),
('c0000000-0000-0000-0000-000000000002', 'MATH 243', 'Business Calculus II with Trigonometry', 4, 'CSU/UC transferable business calculus II course'),
('c0000000-0000-0000-0000-000000000002', 'MATH 251', 'Analytical Geometry and Calculus I', 5, 'CSU/UC transferable calculus I course'),
('c0000000-0000-0000-0000-000000000002', 'MATH 252', 'Analytical Geometry and Calculus II', 5, 'CSU/UC transferable calculus II course'),
('c0000000-0000-0000-0000-000000000002', 'MATH 253', 'Analytic Geometry and Calculus III', 5, 'CSU/UC transferable calculus III course'),
('c0000000-0000-0000-0000-000000000002', 'MATH 270', 'Linear Algebra', 3, 'CSU/UC transferable linear algebra course'),
('c0000000-0000-0000-0000-000000000002', 'MATH 275', 'Ordinary Differential Equations', 3, 'CSU/UC transferable differential equations course'),
('c0000000-0000-0000-0000-000000000002', 'MATH 695', 'Independent Study', 0.5, 'CSU independent study'),
('c0000000-0000-0000-0000-000000000002', 'MATH 825', 'Just-In-Time Support for Path to Calculus', 2, 'Support course for path to calculus'),
('c0000000-0000-0000-0000-000000000002', 'MATH 841', 'Just-In-Time Support for Business Calculus I', 1, 'Support course for business calculus I'),
('c0000000-0000-0000-0000-000000000002', 'MATH 851', 'Just in Time Support for Calculus I', 2, 'Support course for calculus I')
ON CONFLICT (institution_id, code) DO NOTHING;

-- =============================================================================
-- SKYLINE MATHEMATICS (MATH)
-- =============================================================================
INSERT INTO courses (institution_id, code, title, units, description) VALUES
('c0000000-0000-0000-0000-000000000003', 'MATH 120', 'Intermediate Algebra', 5, 'Non-transferable intermediate algebra course'),
('c0000000-0000-0000-0000-000000000003', 'MATH 130', 'Trigonometry', 4, 'CSU transferable trigonometry course'),
('c0000000-0000-0000-0000-000000000003', 'MATH 150', 'Mathematics for Elementary School Teachers', 3, 'CSU/UC transferable elementary education math course'),
('c0000000-0000-0000-0000-000000000003', 'MATH 201', 'Math in Society', 3, 'CSU/UC transferable math in society course'),
('c0000000-0000-0000-0000-000000000003', 'MATH 211', 'Introduction to Data Science', 4, 'CSU/UC transferable data science course'),
('c0000000-0000-0000-0000-000000000003', 'MATH 212', 'Computational and Applied Calculus', 4, 'CSU transferable computational calculus course'),
('c0000000-0000-0000-0000-000000000003', 'MATH 222', 'Precalculus', 5, 'CSU/UC transferable precalculus course'),
('c0000000-0000-0000-0000-000000000003', 'MATH 225', 'Path to Calculus', 6, 'CSU/UC transferable path to calculus course'),
('c0000000-0000-0000-0000-000000000003', 'MATH 241', 'Applied Calculus I', 5, 'CSU/UC transferable applied calculus I course'),
('c0000000-0000-0000-0000-000000000003', 'MATH 242', 'Applied Calculus II', 3, 'CSU/UC transferable applied calculus II course'),
('c0000000-0000-0000-0000-000000000003', 'MATH 243', 'Applied Calculus II with Trigonometry', 4, 'CSU/UC transferable applied calculus with trigonometry course'),
('c0000000-0000-0000-0000-000000000003', 'MATH 251', 'Calculus with Analytic Geometry I', 5, 'CSU/UC transferable calculus I course'),
('c0000000-0000-0000-0000-000000000003', 'MATH 252', 'Calculus with Analytic Geometry II', 5, 'CSU/UC transferable calculus II course'),
('c0000000-0000-0000-0000-000000000003', 'MATH 253', 'Calculus with Analytic Geometry III', 5, 'CSU/UC transferable calculus III course'),
('c0000000-0000-0000-0000-000000000003', 'MATH 270', 'Linear Algebra', 3, 'CSU/UC transferable linear algebra course'),
('c0000000-0000-0000-0000-000000000003', 'MATH 275', 'Ordinary Differential Equations', 3, 'CSU/UC transferable differential equations course'),
('c0000000-0000-0000-0000-000000000003', 'MATH 650', 'Mathematics Supplement', 0.5, 'Non-transferable mathematics supplement'),
('c0000000-0000-0000-0000-000000000003', 'MATH 819', 'Mathematics Development', 3, 'Non-transferable mathematics development course'),
('c0000000-0000-0000-0000-000000000003', 'MATH 825', 'Just-In-Time Support for Path to Calculus', 2, 'Support course for path to calculus'),
('c0000000-0000-0000-0000-000000000003', 'MATH 830', 'Just-In-Time Support for Analytical Trigonometry', 1, 'Support course for trigonometry'),
('c0000000-0000-0000-0000-000000000003', 'MATH 841', 'Just-In-Time Support for Applied Calculus I', 1, 'Support course for applied calculus I'),
('c0000000-0000-0000-0000-000000000003', 'MATH 851', 'Just-In-Time Support for Calculus I', 2, 'Support course for calculus I')
ON CONFLICT (institution_id, code) DO NOTHING;
