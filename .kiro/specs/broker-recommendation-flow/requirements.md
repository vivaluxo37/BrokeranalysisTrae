# Requirements Document

## Introduction

The Broker Recommendation Flow Update introduces a comprehensive 6-step guided questionnaire system that helps visitors find personalized broker recommendations based on their trading preferences, experience level, and requirements. This feature transforms the current self-service broker search into an intelligent recommendation engine with authentication-based result saving, comparison functionality, and seamless integration with the existing homepage.

The system will guide users through a structured questionnaire, provide real-time broker filtering based on their selections, and offer authenticated users the ability to save and compare their recommended brokers. This feature aims to improve user engagement, increase conversion rates, and provide a more personalized broker discovery experience.

## Requirements

### Requirement 1: Entry Point and Navigation

**User Story:** As a visitor to the website, I want to easily access the broker recommendation system so that I can get personalized broker suggestions without having to manually search through all available options.

#### Acceptance Criteria

1. WHEN a visitor clicks "Get Broker Recommendation" button THEN the system SHALL redirect them to the 6-step questionnaire page
2. WHEN the questionnaire page loads THEN the system SHALL display a clear progress indicator showing "Step 1 of 6"
3. WHEN a visitor accesses the questionnaire page directly via URL THEN the system SHALL load the questionnaire starting from Step 1
4. WHEN a visitor navigates away from the questionnaire and returns THEN the system SHALL preserve their progress if they haven't completed all steps

### Requirement 2: 6-Step Questionnaire System

**User Story:** As a visitor seeking broker recommendations, I want to complete a structured 6-step questionnaire so that I can receive personalized broker suggestions based on my specific trading needs and preferences.

#### Acceptance Criteria

1. WHEN the questionnaire loads THEN Step 1 SHALL display a dropdown containing all countries in the world except North Korea
2. WHEN a user selects a country in Step 1 THEN the system SHALL immediately update the broker results panel on the right side
3. WHEN a user progresses to Steps 2-6 THEN each option SHALL display with a checkbox/tick box on the left for selection
4. WHEN a user selects any option in Steps 2-6 THEN the broker results panel SHALL update instantly to reflect the filtered results
5. WHEN a user completes all 6 steps THEN the system SHALL display the final broker recommendations
6. WHEN a user wants to modify previous selections THEN the system SHALL allow navigation back to any previous step without losing other selections

### Requirement 3: Dynamic Results Panel

**User Story:** As a user completing the questionnaire, I want to see how my selections affect the broker recommendations in real-time so that I can understand how each choice impacts my available options.

#### Acceptance Criteria

1. WHEN the questionnaire page loads THEN the right-hand panel SHALL display all available brokers initially
2. WHEN a user makes any selection in any step THEN the broker list SHALL update within 500ms to show only matching brokers
3. WHEN no brokers match the current criteria THEN the system SHALL display a message "No brokers match your criteria. Please adjust your selections."
4. WHEN the user clears a selection THEN the broker list SHALL expand to include previously filtered brokers
5. WHEN the broker list updates THEN the system SHALL maintain the same display format as existing broker cards

### Requirement 4: Educational Content Integration

**User Story:** As a visitor using the recommendation system, I want access to helpful information about broker selection and rating methodology so that I can make informed decisions about the recommendations provided.

#### Acceptance Criteria

1. WHEN the questionnaire page loads THEN the system SHALL display a "Find My Broker FAQ" section at the bottom of the page
2. WHEN the questionnaire page loads THEN the system SHALL display a "How We Rate Brokers" section similar to BrokerChooser's methodology
3. WHEN a user clicks on FAQ items THEN the system SHALL expand the content to show detailed answers
4. WHEN a user clicks on rating methodology THEN the system SHALL display detailed information about the rating criteria and process

### Requirement 5: Results Saving and Authentication

**User Story:** As a user who has completed the questionnaire, I want to save my broker recommendations so that I can review them later and compare different options without having to retake the questionnaire.

#### Acceptance Criteria

1. WHEN a user completes the questionnaire THEN the system SHALL present an option to "Save Toplist / Results"
2. WHEN a user clicks "Save Results" without being logged in THEN the system SHALL redirect them to the Login/Register page
3. WHEN a user successfully logs in or registers THEN the system SHALL redirect them back to the results page with their saved brokers intact
4. WHEN a logged-in user clicks "Save Results" THEN the system SHALL save the results immediately and display a confirmation message
5. WHEN a user has saved results THEN the system SHALL allow them to access these results from their account dashboard

### Requirement 6: Authentication System Integration

**User Story:** As a visitor who wants to save my broker recommendations, I want to easily create an account or log in using multiple authentication methods so that I can quickly access the save functionality without friction.

#### Acceptance Criteria

1. WHEN a user accesses the Login/Register page THEN the system SHALL provide email/password registration and login options
2. WHEN a user accesses the Login/Register page THEN the system SHALL provide Google login integration via Supabase
3. WHEN a user accesses the Login/Register page THEN the system SHALL provide Facebook login integration via Supabase
4. WHEN a user successfully authenticates THEN the system SHALL create or update their user profile in Supabase
5. WHEN authentication fails THEN the system SHALL display clear error messages and allow retry attempts
6. WHEN a user completes authentication THEN the system SHALL redirect them back to their previous location with context preserved

### Requirement 7: Broker Comparison Functionality

**User Story:** As a user viewing my saved broker recommendations, I want to select multiple brokers for detailed comparison so that I can make an informed decision about which broker best meets my needs.

#### Acceptance Criteria

1. WHEN saved results are displayed THEN each broker card SHALL include a small "Compare" checkbox
2. WHEN a user selects brokers for comparison THEN a static "Compare" button SHALL appear at the bottom of the screen
3. WHEN a user selects more than 5 brokers THEN the system SHALL display a warning message limiting comparison to 5 brokers maximum
4. WHEN a user clicks the "Compare" button THEN the system SHALL redirect to a Compare Page with the selected brokers
5. WHEN no brokers are selected THEN the Compare button SHALL remain hidden
6. WHEN a user deselects all brokers THEN the Compare button SHALL disappear

### Requirement 8: Seamless Authentication Flow

**User Story:** As a user who tries to save results without being logged in, I want the system to remember my questionnaire results and broker selections so that I don't lose my progress during the authentication process.

#### Acceptance Criteria

1. WHEN a user attempts to save results without authentication THEN the system SHALL store their questionnaire responses and results in session storage
2. WHEN a user completes authentication THEN the system SHALL restore their questionnaire results and display their saved brokers
3. WHEN a user abandons the authentication process THEN the system SHALL retain their session data for 24 hours
4. WHEN a user returns within 24 hours THEN the system SHALL restore their previous questionnaire state
5. WHEN session data expires THEN the system SHALL redirect users to restart the questionnaire

### Requirement 9: Homepage Integration

**User Story:** As a returning user who has saved broker recommendations, I want to see my personalized broker suggestions on the homepage so that I can quickly access my recommendations without navigating through the questionnaire again.

#### Acceptance Criteria

1. WHEN a logged-in user with saved results visits the homepage THEN the "Find Your Perfect Broker" section SHALL display their saved brokers from the toplist
2. WHEN a logged-in user has no saved results THEN the homepage SHALL display the standard "Get Broker Recommendation" call-to-action
3. WHEN a user's saved results are displayed on homepage THEN each broker card SHALL maintain the same design as the standard homepage broker cards
4. WHEN a user clicks on a saved broker from the homepage THEN the system SHALL navigate to the broker's detail page
5. WHEN a user wants to retake the questionnaire THEN the homepage SHALL provide a "Get New Recommendations" option

### Requirement 10: Data Persistence and Performance

**User Story:** As a user of the recommendation system, I want my interactions to be fast and reliable so that I can efficiently complete the questionnaire and access my saved results without delays or data loss.

#### Acceptance Criteria

1. WHEN a user makes selections in the questionnaire THEN the system SHALL save progress to local storage after each step
2. WHEN the broker results panel updates THEN the system SHALL complete the update within 500ms
3. WHEN a user saves results to their account THEN the system SHALL persist the data in Supabase within 2 seconds
4. WHEN a user accesses saved results THEN the system SHALL load the data within 1 second
5. WHEN the system experiences an error THEN it SHALL display user-friendly error messages and provide retry options
6. WHEN a user's session expires THEN the system SHALL gracefully handle re-authentication without data loss