export const FORM_TEMPLATES = {
  'student-registration': {
    title: 'Student Registration Form',
    description: 'Collect student information for enrollment and class assignments',
    questions: [
      {
        id: 'name',
        type: 'short-answer',
        question: 'Full Name',
        required: true,
        placeholder: 'Enter your full name',
        description: 'Please enter your legal full name as it appears on official documents'
      },
      {
        id: 'email',
        type: 'email',
        question: 'Email Address',
        required: true,
        placeholder: 'Enter your email address',
        description: 'We will use this email for all communications'
      },
      {
        id: 'dob',
        type: 'date',
        question: 'Date of Birth',
        required: true,
        description: 'Must be at least 16 years old to register'
      },
      {
        id: 'grade',
        type: 'multiple-choice',
        question: 'Grade Level',
        required: true,
        options: ['Freshman', 'Sophomore', 'Junior', 'Senior']
      },
      {
        id: 'comments',
        type: 'paragraph',
        question: 'Additional Comments',
        required: false,
        placeholder: 'Any additional information you would like to share',
        description: 'Optional: Include any special requirements or notes'
      }
    ],
    settings: {
      theme: 'educational',
      submitButtonText: 'Submit Registration',
      thankYouMessage: 'Thank you for registering! We will review your information and contact you soon.'
    }
  },
  'job-application': {
    title: 'Job Application Form',
    description: 'Apply for open positions with our standard application form',
    questions: [
      {
        id: 'name',
        type: 'short-answer',
        question: 'Full Name',
        required: true,
        placeholder: 'Enter your full name',
        description: 'As it appears on official documents'
      },
      {
        id: 'email',
        type: 'email',
        question: 'Email Address',
        required: true,
        placeholder: 'Enter your email address'
      },
      {
        id: 'phone',
        type: 'short-answer',
        question: 'Phone Number',
        required: true,
        placeholder: 'Enter your phone number'
      },
      {
        id: 'experience',
        type: 'paragraph',
        question: 'Work Experience',
        required: true,
        placeholder: 'List your relevant work experience',
        description: 'Include company names, positions, and dates'
      },
      {
        id: 'education',
        type: 'paragraph',
        question: 'Education',
        required: true,
        placeholder: 'List your educational background',
        description: 'Include institutions, degrees, and graduation dates'
      },
      {
        id: 'resume',
        type: 'file-upload',
        question: 'Resume/CV',
        required: true,
        description: 'Upload your resume in PDF format (max 5MB)'
      },
      {
        id: 'cover',
        type: 'paragraph',
        question: 'Cover Letter',
        required: false,
        placeholder: 'Write your cover letter here',
        description: 'Tell us why you would be a good fit for this position'
      }
    ],
    settings: {
      theme: 'professional',
      submitButtonText: 'Submit Application',
      thankYouMessage: 'Thank you for your application! We will review it and get back to you soon.'
    }
  },
  'event-registration': {
    title: 'Event Registration Form',
    description: 'Register attendees for events and gatherings',
    questions: [
      {
        id: 'name',
        type: 'short-answer',
        question: 'Full Name',
        required: true,
        placeholder: 'Enter your full name'
      },
      {
        id: 'email',
        type: 'email',
        question: 'Email Address',
        required: true,
        placeholder: 'Enter your email address'
      },
      {
        id: 'ticket-type',
        type: 'multiple-choice',
        question: 'Ticket Type',
        required: true,
        options: ['Standard', 'VIP', 'Group (5+ people)', 'Student']
      },
      {
        id: 'attendees',
        type: 'number',
        question: 'Number of Attendees',
        required: true,
        placeholder: 'Enter number of attendees',
        validation: {
          min: 1,
          max: 10,
          message: 'Please enter a number between 1 and 10'
        }
      },
      {
        id: 'dietary',
        type: 'checkboxes',
        question: 'Dietary Requirements',
        required: false,
        options: ['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'None']
      },
      {
        id: 'special-requests',
        type: 'paragraph',
        question: 'Special Requests',
        required: false,
        placeholder: 'Any special accommodations needed?'
      }
    ],
    settings: {
      theme: 'friendly',
      submitButtonText: 'Register Now',
      thankYouMessage: 'Thanks for registering! You will receive a confirmation email shortly.'
    }
  },
  'contact-form': {
    title: 'Contact Form',
    description: 'Professional contact form with message and priority options',
    questions: [
      {
        id: 'name',
        type: 'short-answer',
        question: 'Full Name',
        required: true,
        placeholder: 'Enter your full name'
      },
      {
        id: 'email',
        type: 'email',
        question: 'Email Address',
        required: true,
        placeholder: 'Enter your email address'
      },
      {
        id: 'subject',
        type: 'short-answer',
        question: 'Subject',
        required: true,
        placeholder: 'Enter message subject'
      },
      {
        id: 'department',
        type: 'dropdown',
        question: 'Department',
        required: true,
        options: ['Sales', 'Support', 'Technical', 'Billing', 'General']
      },
      {
        id: 'priority',
        type: 'multiple-choice',
        question: 'Priority Level',
        required: true,
        options: ['Low', 'Medium', 'High', 'Urgent']
      },
      {
        id: 'message',
        type: 'paragraph',
        question: 'Message',
        required: true,
        placeholder: 'Enter your message here'
      }
    ],
    settings: {
      theme: 'professional',
      submitButtonText: 'Send Message',
      thankYouMessage: 'Thank you for contacting us! We will respond to your message soon.'
    }
  },
  'feedback-form': {
    title: 'Customer Feedback Form',
    description: 'Collect detailed feedback about products or services',
    questions: [
      {
        id: 'name',
        type: 'short-answer',
        question: 'Full Name',
        required: false,
        placeholder: 'Enter your name (optional)'
      },
      {
        id: 'email',
        type: 'email',
        question: 'Email Address',
        required: false,
        placeholder: 'Enter your email (optional)'
      },
      {
        id: 'product',
        type: 'dropdown',
        question: 'Product/Service',
        required: true,
        options: ['Product A', 'Product B', 'Service X', 'Service Y']
      },
      {
        id: 'rating',
        type: 'rating',
        question: 'Overall Rating',
        required: true,
        scaleMax: 5,
        scaleMin: 1,
        scaleMinLabel: 'Very Dissatisfied',
        scaleMaxLabel: 'Very Satisfied'
      },
      {
        id: 'satisfaction',
        type: 'linear-scale',
        question: 'How likely are you to recommend us?',
        required: true,
        scaleMax: 10,
        scaleMin: 0,
        scaleMinLabel: 'Not at all likely',
        scaleMaxLabel: 'Extremely likely'
      },
      {
        id: 'likes',
        type: 'paragraph',
        question: 'What did you like most?',
        required: false,
        placeholder: 'Tell us what you enjoyed'
      },
      {
        id: 'improvements',
        type: 'paragraph',
        question: 'What could be improved?',
        required: false,
        placeholder: 'Share your suggestions for improvement'
      }
    ],
    settings: {
      theme: 'friendly',
      submitButtonText: 'Submit Feedback',
      thankYouMessage: 'Thank you for your valuable feedback!'
    }
  },
  'parent-teacher-conference': {
    title: 'Parent-Teacher Conference Form',
    description: 'Schedule meetings and collect parent feedback and concerns',
    questions: [
      {
        id: 'parent-name',
        type: 'short-answer',
        question: 'Parent/Guardian Name',
        required: true,
        placeholder: 'Enter your full name'
      },
      {
        id: 'student-name',
        type: 'short-answer',
        question: 'Student Name',
        required: true,
        placeholder: 'Enter student\'s full name'
      },
      {
        id: 'email',
        type: 'email',
        question: 'Email Address',
        required: true,
        placeholder: 'Enter your email address'
      },
      {
        id: 'preferred-date',
        type: 'date',
        question: 'Preferred Meeting Date',
        required: true,
        description: 'Select your preferred date for the conference'
      },
      {
        id: 'preferred-time',
        type: 'multiple-choice',
        question: 'Preferred Time Slot',
        required: true,
        options: ['Morning (8-10 AM)', 'Mid-Morning (10-12 PM)', 'Afternoon (1-3 PM)', 'Late Afternoon (3-5 PM)']
      },
      {
        id: 'subjects',
        type: 'checkboxes',
        question: 'Subjects to Discuss',
        required: true,
        options: ['Math', 'Science', 'English', 'History', 'Art', 'Physical Education', 'Other']
      },
      {
        id: 'concerns',
        type: 'paragraph',
        question: 'Specific Concerns or Topics',
        required: false,
        placeholder: 'Please list any specific concerns or topics you would like to discuss'
      }
    ],
    settings: {
      theme: 'educational',
      submitButtonText: 'Schedule Conference',
      thankYouMessage: 'Thank you for scheduling a conference. We will confirm your appointment time shortly.'
    }
  },
  'field-trip-permission': {
    title: 'Field Trip Permission Form',
    description: 'Get parental consent and collect necessary information for school trips',
    questions: [
      {
        id: 'student-name',
        type: 'short-answer',
        question: 'Student Name',
        required: true,
        placeholder: 'Enter student\'s full name'
      },
      {
        id: 'parent-name',
        type: 'short-answer',
        question: 'Parent/Guardian Name',
        required: true,
        placeholder: 'Enter parent/guardian\'s full name'
      },
      {
        id: 'email',
        type: 'email',
        question: 'Email Address',
        required: true,
        placeholder: 'Enter your email address'
      },
      {
        id: 'phone',
        type: 'short-answer',
        question: 'Emergency Contact Number',
        required: true,
        placeholder: 'Enter emergency contact number'
      },
      {
        id: 'medical',
        type: 'paragraph',
        question: 'Medical Information',
        required: true,
        placeholder: 'List any medical conditions, allergies, or medications',
        description: 'This information will be kept confidential and used only in case of emergency'
      },
      {
        id: 'consent',
        type: 'multiple-choice',
        question: 'Permission to Participate',
        required: true,
        options: ['Yes, I give permission', 'No, I do not give permission']
      },
      {
        id: 'additional-info',
        type: 'paragraph',
        question: 'Additional Information',
        required: false,
        placeholder: 'Any additional information we should know about'
      }
    ],
    settings: {
      theme: 'educational',
      submitButtonText: 'Submit Permission Form',
      thankYouMessage: 'Thank you for submitting the permission form.'
    }
  },
  'course-evaluation': {
    title: 'Course Evaluation Form',
    description: 'Gather student feedback on courses, teaching methods, and curriculum',
    questions: [
      {
        id: 'course-name',
        type: 'dropdown',
        question: 'Course Name',
        required: true,
        options: ['Mathematics', 'Science', 'English', 'History', 'Art', 'Physical Education', 'Other']
      },
      {
        id: 'instructor',
        type: 'short-answer',
        question: 'Instructor Name',
        required: true,
        placeholder: 'Enter instructor\'s name'
      },
      {
        id: 'semester',
        type: 'dropdown',
        question: 'Semester',
        required: true,
        options: ['Fall 2023', 'Spring 2024', 'Summer 2024']
      },
      {
        id: 'overall-rating',
        type: 'rating',
        question: 'Overall Course Rating',
        required: true,
        scaleMax: 5,
        scaleMin: 1,
        scaleMinLabel: 'Poor',
        scaleMaxLabel: 'Excellent'
      },
      {
        id: 'teaching-effectiveness',
        type: 'rating',
        question: 'Teaching Effectiveness',
        required: true,
        scaleMax: 5,
        scaleMin: 1,
        scaleMinLabel: 'Not Effective',
        scaleMaxLabel: 'Very Effective'
      },
      {
        id: 'course-content',
        type: 'rating',
        question: 'Course Content Quality',
        required: true,
        scaleMax: 5,
        scaleMin: 1,
        scaleMinLabel: 'Poor',
        scaleMaxLabel: 'Excellent'
      },
      {
        id: 'strengths',
        type: 'paragraph',
        question: 'Course Strengths',
        required: false,
        placeholder: 'What aspects of the course were most beneficial?'
      },
      {
        id: 'improvements',
        type: 'paragraph',
        question: 'Suggested Improvements',
        required: false,
        placeholder: 'What aspects of the course could be improved?'
      }
    ],
    settings: {
      theme: 'educational',
      submitButtonText: 'Submit Evaluation',
      thankYouMessage: 'Thank you for your feedback! Your input helps us improve our courses.'
    }
  },
  'employee-onboarding': {
    title: 'Employee Onboarding Form',
    description: 'Collect new hire information and documentation efficiently',
    questions: [
      {
        id: 'full-name',
        type: 'short-answer',
        question: 'Full Legal Name',
        required: true,
        placeholder: 'Enter your full legal name'
      },
      {
        id: 'email',
        type: 'email',
        question: 'Email Address',
        required: true,
        placeholder: 'Enter your email address'
      },
      {
        id: 'phone',
        type: 'short-answer',
        question: 'Phone Number',
        required: true,
        placeholder: 'Enter your phone number'
      },
      {
        id: 'start-date',
        type: 'date',
        question: 'Start Date',
        required: true,
        description: 'Your first day of employment'
      },
      {
        id: 'department',
        type: 'dropdown',
        question: 'Department',
        required: true,
        options: ['Sales', 'Marketing', 'Engineering', 'HR', 'Finance', 'Operations', 'Other']
      },
      {
        id: 'emergency-contact',
        type: 'paragraph',
        question: 'Emergency Contact Information',
        required: true,
        placeholder: 'Name, relationship, phone number'
      },
      {
        id: 'tax-info',
        type: 'file-upload',
        question: 'Tax Forms',
        required: true,
        description: 'Upload completed W-4 and I-9 forms (PDF format)'
      },
      {
        id: 'direct-deposit',
        type: 'file-upload',
        question: 'Direct Deposit Information',
        required: true,
        description: 'Upload voided check or bank document'
      }
    ],
    settings: {
      theme: 'professional',
      submitButtonText: 'Submit Onboarding Forms',
      thankYouMessage: 'Thank you for completing your onboarding forms. Welcome to the team!'
    }
  },
  'performance-review': {
    title: 'Performance Review Form',
    description: 'Conduct comprehensive employee performance evaluations',
    questions: [
      {
        id: 'employee-name',
        type: 'short-answer',
        question: 'Employee Name',
        required: true,
        placeholder: 'Enter employee\'s full name'
      },
      {
        id: 'position',
        type: 'short-answer',
        question: 'Position/Title',
        required: true,
        placeholder: 'Enter current position'
      },
      {
        id: 'review-period',
        type: 'dropdown',
        question: 'Review Period',
        required: true,
        options: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Annual 2024']
      },
      {
        id: 'performance-goals',
        type: 'rating',
        question: 'Achievement of Performance Goals',
        required: true,
        scaleMax: 5,
        scaleMin: 1,
        scaleMinLabel: 'Below Expectations',
        scaleMaxLabel: 'Exceeds Expectations'
      },
      {
        id: 'quality-work',
        type: 'rating',
        question: 'Quality of Work',
        required: true,
        scaleMax: 5,
        scaleMin: 1,
        scaleMinLabel: 'Needs Improvement',
        scaleMaxLabel: 'Outstanding'
      },
      {
        id: 'strengths',
        type: 'paragraph',
        question: 'Key Strengths',
        required: true,
        placeholder: 'List main areas of strength and accomplishments'
      },
      {
        id: 'improvements',
        type: 'paragraph',
        question: 'Areas for Improvement',
        required: true,
        placeholder: 'Identify areas needing development'
      },
      {
        id: 'goals',
        type: 'paragraph',
        question: 'Goals for Next Period',
        required: true,
        placeholder: 'Set specific, measurable goals for the next review period'
      }
    ],
    settings: {
      theme: 'professional',
      submitButtonText: 'Submit Review',
      thankYouMessage: 'Thank you for completing the performance review.'
    }
  },
  'employee-satisfaction': {
    title: 'Employee Satisfaction Survey',
    description: 'Measure workplace satisfaction and gather improvement suggestions',
    questions: [
      {
        id: 'department',
        type: 'dropdown',
        question: 'Department',
        required: true,
        options: ['Sales', 'Marketing', 'Engineering', 'HR', 'Finance', 'Operations', 'Other']
      },
      {
        id: 'tenure',
        type: 'dropdown',
        question: 'Length of Employment',
        required: true,
        options: ['Less than 1 year', '1-2 years', '3-5 years', '5+ years']
      },
      {
        id: 'work-satisfaction',
        type: 'rating',
        question: 'Overall Job Satisfaction',
        required: true,
        scaleMax: 5,
        scaleMin: 1,
        scaleMinLabel: 'Very Dissatisfied',
        scaleMaxLabel: 'Very Satisfied'
      },
      {
        id: 'work-life-balance',
        type: 'rating',
        question: 'Work-Life Balance',
        required: true,
        scaleMax: 5,
        scaleMin: 1,
        scaleMinLabel: 'Poor',
        scaleMaxLabel: 'Excellent'
      },
      {
        id: 'management',
        type: 'rating',
        question: 'Satisfaction with Management',
        required: true,
        scaleMax: 5,
        scaleMin: 1,
        scaleMinLabel: 'Very Dissatisfied',
        scaleMaxLabel: 'Very Satisfied'
      },
      {
        id: 'benefits',
        type: 'checkboxes',
        question: 'Most Valued Benefits',
        required: true,
        options: ['Health Insurance', 'Retirement Plan', 'Paid Time Off', 'Professional Development', 'Remote Work', 'Flexible Hours']
      },
      {
        id: 'improvements',
        type: 'paragraph',
        question: 'Suggested Improvements',
        required: false,
        placeholder: 'What changes would improve your job satisfaction?'
      }
    ],
    settings: {
      theme: 'professional',
      submitButtonText: 'Submit Survey',
      thankYouMessage: 'Thank you for your feedback. Your input helps us create a better workplace.'
    }
  },
  'manuscript-submission': {
    title: 'Manuscript Submission Form',
    description: 'Accept and organize manuscript submissions from authors',
    questions: [
      {
        id: 'author-name',
        type: 'short-answer',
        question: 'Author Name',
        required: true,
        placeholder: 'Enter your full name'
      },
      {
        id: 'email',
        type: 'email',
        question: 'Email Address',
        required: true,
        placeholder: 'Enter your email address'
      },
      {
        id: 'manuscript-title',
        type: 'short-answer',
        question: 'Manuscript Title',
        required: true,
        placeholder: 'Enter the title of your manuscript'
      },
      {
        id: 'genre',
        type: 'dropdown',
        question: 'Genre',
        required: true,
        options: ['Fiction', 'Non-Fiction', 'Poetry', 'Children\'s Literature', 'Academic', 'Other']
      },
      {
        id: 'word-count',
        type: 'number',
        question: 'Word Count',
        required: true,
        placeholder: 'Enter total word count'
      },
      {
        id: 'manuscript-file',
        type: 'file-upload',
        question: 'Manuscript File',
        required: true,
        description: 'Upload your manuscript (DOC, DOCX, or PDF format)'
      },
      {
        id: 'synopsis',
        type: 'paragraph',
        question: 'Synopsis',
        required: true,
        placeholder: 'Provide a brief synopsis of your manuscript'
      }
    ],
    settings: {
      theme: 'professional',
      submitButtonText: 'Submit Manuscript',
      thankYouMessage: 'Thank you for your submission. We will review your manuscript and get back to you soon.'
    }
  },
  'reader-feedback': {
    title: 'Reader Feedback Form',
    description: 'Collect reader reviews and feedback on published content',
    questions: [
      {
        id: 'book-title',
        type: 'dropdown',
        question: 'Book Title',
        required: true,
        options: ['Book A', 'Book B', 'Book C', 'Other']
      },
      {
        id: 'rating',
        type: 'rating',
        question: 'Overall Rating',
        required: true,
        scaleMax: 5,
        scaleMin: 1,
        scaleMinLabel: 'Poor',
        scaleMaxLabel: 'Excellent'
      },
      {
        id: 'review',
        type: 'paragraph',
        question: 'Written Review',
        required: true,
        placeholder: 'Share your thoughts about the book'
      },
      {
        id: 'recommend',
        type: 'multiple-choice',
        question: 'Would you recommend this book?',
        required: true,
        options: ['Yes', 'No', 'Maybe']
      },
      {
        id: 'demographics',
        type: 'checkboxes',
        question: 'Reader Demographics',
        required: false,
        options: ['Under 18', '18-24', '25-34', '35-44', '45-54', '55+']
      }
    ],
    settings: {
      theme: 'friendly',
      submitButtonText: 'Submit Review',
      thankYouMessage: 'Thank you for your review! Your feedback helps other readers.'
    }
  },
  'author-royalty': {
    title: 'Author Royalty Form',
    description: 'Manage author payments and royalty information',
    questions: [
      {
        id: 'author-name',
        type: 'short-answer',
        question: 'Author Name',
        required: true,
        placeholder: 'Enter your full name'
      },
      {
        id: 'tax-id',
        type: 'short-answer',
        question: 'Tax ID/SSN',
        required: true,
        placeholder: 'Enter your tax identification number'
      },
      {
        id: 'payment-method',
        type: 'dropdown',
        question: 'Preferred Payment Method',
        required: true,
        options: ['Direct Deposit', 'Check', 'Wire Transfer', 'PayPal']
      },
      {
        id: 'bank-info',
        type: 'paragraph',
        question: 'Banking Information',
        required: true,
        placeholder: 'Enter your banking details for payments'
      },
      {
        id: 'tax-forms',
        type: 'file-upload',
        question: 'Tax Forms',
        required: true,
        description: 'Upload completed W-9 or relevant tax forms'
      }
    ],
    settings: {
      theme: 'professional',
      submitButtonText: 'Submit Royalty Information',
      thankYouMessage: 'Thank you for submitting your royalty information.'
    }
  },
  'book-marketing': {
    title: 'Book Marketing Survey',
    description: 'Gather market research data for book promotion strategies',
    questions: [
      {
        id: 'book-title',
        type: 'short-answer',
        question: 'Book Title',
        required: true,
        placeholder: 'Enter book title'
      },
      {
        id: 'target-audience',
        type: 'checkboxes',
        question: 'Target Audience',
        required: true,
        options: ['Children', 'Young Adults', 'Adults', 'Professionals', 'Academics', 'Other']
      },
      {
        id: 'marketing-channels',
        type: 'checkboxes',
        question: 'Preferred Marketing Channels',
        required: true,
        options: ['Social Media', 'Email', 'Print Ads', 'Online Ads', 'Book Fairs', 'Other']
      },
      {
        id: 'budget',
        type: 'dropdown',
        question: 'Marketing Budget Range',
        required: true,
        options: ['Under $1,000', '$1,000-$5,000', '$5,000-$10,000', '$10,000+']
      },
      {
        id: 'timeline',
        type: 'date',
        question: 'Campaign Start Date',
        required: true,
        description: 'When would you like to start the marketing campaign?'
      }
    ],
    settings: {
      theme: 'professional',
      submitButtonText: 'Submit Marketing Survey',
      thankYouMessage: 'Thank you for completing the marketing survey.'
    }
  },
  'user-onboarding': {
    title: 'User Onboarding Form',
    description: 'Welcome new users and customize their learning experience',
    questions: [
      {
        id: 'name',
        type: 'short-answer',
        question: 'Full Name',
        required: true,
        placeholder: 'Enter your full name'
      },
      {
        id: 'email',
        type: 'email',
        question: 'Email Address',
        required: true,
        placeholder: 'Enter your email address'
      },
      {
        id: 'learning-goals',
        type: 'checkboxes',
        question: 'Learning Goals',
        required: true,
        options: ['Skill Development', 'Career Advancement', 'Academic Success', 'Personal Interest', 'Professional Certification']
      },
      {
        id: 'experience-level',
        type: 'dropdown',
        question: 'Experience Level',
        required: true,
        options: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
      },
      {
        id: 'preferred-learning',
        type: 'checkboxes',
        question: 'Preferred Learning Methods',
        required: true,
        options: ['Video Lessons', 'Interactive Exercises', 'Reading Materials', 'Live Sessions', 'Practice Projects']
      }
    ],
    settings: {
      theme: 'friendly',
      submitButtonText: 'Start Learning Journey',
      thankYouMessage: 'Welcome aboard! We\'re excited to help you achieve your learning goals.'
    }
  },
  'course-feedback': {
    title: 'Course Feedback Form',
    description: 'Collect student feedback on online courses and content quality',
    questions: [
      {
        id: 'course-name',
        type: 'dropdown',
        question: 'Course Name',
        required: true,
        options: ['Course A', 'Course B', 'Course C', 'Other']
      },
      {
        id: 'content-quality',
        type: 'rating',
        question: 'Content Quality',
        required: true,
        scaleMax: 5,
        scaleMin: 1,
        scaleMinLabel: 'Poor',
        scaleMaxLabel: 'Excellent'
      },
      {
        id: 'instructor-rating',
        type: 'rating',
        question: 'Instructor Rating',
        required: true,
        scaleMax: 5,
        scaleMin: 1,
        scaleMinLabel: 'Poor',
        scaleMaxLabel: 'Excellent'
      },
      {
        id: 'technical-issues',
        type: 'paragraph',
        question: 'Technical Issues',
        required: false,
        placeholder: 'Describe any technical issues you encountered'
      },
      {
        id: 'improvements',
        type: 'paragraph',
        question: 'Suggested Improvements',
        required: false,
        placeholder: 'How can we improve the course?'
      }
    ],
    settings: {
      theme: 'educational',
      submitButtonText: 'Submit Feedback',
      thankYouMessage: 'Thank you for your feedback! We\'re constantly working to improve our courses.'
    }
  },
  'beta-testing': {
    title: 'Beta Testing Form',
    description: 'Gather feedback from beta testers for new features and products',
    questions: [
      {
        id: 'tester-name',
        type: 'short-answer',
        question: 'Tester Name',
        required: true,
        placeholder: 'Enter your full name'
      },
      {
        id: 'email',
        type: 'email',
        question: 'Email Address',
        required: true,
        placeholder: 'Enter your email address'
      },
      {
        id: 'feature-testing',
        type: 'checkboxes',
        question: 'Features Tested',
        required: true,
        options: ['Feature A', 'Feature B', 'Feature C', 'Feature D']
      },
      {
        id: 'bugs-found',
        type: 'paragraph',
        question: 'Bug Reports',
        required: false,
        placeholder: 'Describe any bugs or issues you encountered'
      },
      {
        id: 'user-experience',
        type: 'rating',
        question: 'User Experience Rating',
        required: true,
        scaleMax: 5,
        scaleMin: 1,
        scaleMinLabel: 'Poor',
        scaleMaxLabel: 'Excellent'
      },
      {
        id: 'feature-requests',
        type: 'paragraph',
        question: 'Feature Requests',
        required: false,
        placeholder: 'Suggest new features or improvements'
      }
    ],
    settings: {
      theme: 'professional',
      submitButtonText: 'Submit Beta Feedback',
      thankYouMessage: 'Thank you for helping us improve our product!'
    }
  },
  'partnership-inquiry': {
    title: 'Partnership Inquiry Form',
    description: 'Connect with potential educational partners and institutions',
    questions: [
      {
        id: 'institution-name',
        type: 'short-answer',
        question: 'Institution Name',
        required: true,
        placeholder: 'Enter your institution name'
      },
      {
        id: 'contact-name',
        type: 'short-answer',
        question: 'Contact Person',
        required: true,
        placeholder: 'Enter contact person\'s name'
      },
      {
        id: 'email',
        type: 'email',
        question: 'Email Address',
        required: true,
        placeholder: 'Enter your email address'
      },
      {
        id: 'partnership-type',
        type: 'dropdown',
        question: 'Partnership Type',
        required: true,
        options: ['Content Integration', 'Technology Partnership', 'Research Collaboration', 'Distribution Partnership', 'Other']
      },
      {
        id: 'institution-type',
        type: 'dropdown',
        question: 'Institution Type',
        required: true,
        options: ['K-12 School', 'University', 'Corporate Training', 'Online Learning Platform', 'Other']
      },
      {
        id: 'integration-needs',
        type: 'paragraph',
        question: 'Integration Requirements',
        required: true,
        placeholder: 'Describe your technical integration needs'
      }
    ],
    settings: {
      theme: 'professional',
      submitButtonText: 'Submit Inquiry',
      thankYouMessage: 'Thank you for your interest in partnering with us. We\'ll be in touch soon!'
    }
  }
}; 