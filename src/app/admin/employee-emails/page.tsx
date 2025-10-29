'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Mail, Edit2, Save, X, Eye, AlertCircle } from 'lucide-react'

interface EmailTemplate {
  id: string
  title: string
  subject: string
  body: string
  dayNumber: number
  description: string
}

const defaultTemplates: EmailTemplate[] = [
  {
    id: 'welcome-day-1',
    title: 'Welcome Email - Day 1',
    subject: 'Welcome to {companyName}, {employeeName}!',
    body: `Hi {employeeName},

Welcome to {companyName}! We're thrilled to have you join our team.

My name is {adminName}, and I'll be here to support you throughout your onboarding journey. Over the next few weeks, you'll get to know our team, learn about our processes, and start making an impact.

Here's what to expect in your first few days:
• Complete your profile and initial setup
• Meet your team members
• Review our company values and culture
• Start your personalized onboarding journey

If you have any questions or need assistance, don't hesitate to reach out. We're all here to help you succeed.

Looking forward to working with you!

Best regards,
{adminName}
{companyName} Team`,
    dayNumber: 1,
    description: 'Initial welcome email sent on the employee\'s first day'
  },
  {
    id: 'checkin-day-3',
    title: 'Check-in Email - Day 3',
    subject: 'How are you settling in, {employeeName}?',
    body: `Hi {employeeName},

I hope your first few days at {companyName} have been going well!

I wanted to check in and see how you're settling in. By now, you should have completed some of your initial tasks and met a few team members.

Quick check-in questions:
• Do you have everything you need to be productive?
• Have you been able to connect with your team?
• Are there any questions I can help answer?

Remember, your onboarding journey is designed to help you build confidence and connections. Take your time with each task, and don't hesitate to ask questions.

Keep up the great work!

Best,
{adminName}`,
    dayNumber: 3,
    description: 'First check-in to ensure smooth onboarding'
  },
  {
    id: 'week-1-complete',
    title: 'Week 1 Milestone - Day 5',
    subject: 'Great job on your first week, {employeeName}!',
    body: `Hi {employeeName},

Congratulations on completing your first week at {companyName}!

You've made excellent progress in getting to know the team and understanding our culture. Your engagement with the onboarding tasks has been fantastic.

As you move into week 2, you'll start diving deeper into your role and building stronger connections with your teammates. This is where things get really exciting!

Key focus areas for next week:
• Continue building relationships with team members
• Deepen your understanding of our processes
• Start taking on small projects or tasks in your area

Remember, I'm here if you need anything. Keep up the momentum!

Cheers,
{adminName}`,
    dayNumber: 5,
    description: 'Celebrate completion of first week'
  },
  {
    id: 'week-2-checkin',
    title: 'Week 2 Check-in - Day 10',
    subject: 'Your progress at {companyName}',
    body: `Hi {employeeName},

You're now into your second week at {companyName}, and I wanted to share how impressed we are with your progress!

As you continue your journey, you should be feeling more connected to the team and more confident in your role. This is a great time to:
• Ask for feedback on your initial work
• Share your ideas and perspectives
• Identify areas where you want to grow

Your unique perspective as a new team member is valuable—don't hesitate to share your observations and suggestions.

How are things going? Is there anything specific you'd like to discuss or any support you need?

Looking forward to seeing your continued growth!

Best,
{adminName}`,
    dayNumber: 10,
    description: 'Mid-onboarding check-in and encouragement'
  },
  {
    id: 'onboarding-complete',
    title: 'Onboarding Complete - Day 14',
    subject: 'Congratulations on completing your onboarding, {employeeName}!',
    body: `Hi {employeeName},

Congratulations! You've successfully completed your onboarding journey at {companyName}.

Over the past two weeks, you've:
✓ Built confidence in your role
✓ Created connections with your team
✓ Developed the foundation for productivity

This is just the beginning of your journey with us. You're now fully equipped to make a significant impact, and we're excited to see what you'll accomplish.

As you move forward:
• Continue to seek feedback and learning opportunities
• Keep building relationships across the organization
• Don't hesitate to take initiative on projects that interest you

Thank you for your enthusiasm and dedication during the onboarding process. We're lucky to have you on the team!

Welcome aboard (officially)!

Best regards,
{adminName}
{companyName} Team`,
    dayNumber: 14,
    description: 'Final email celebrating onboarding completion'
  }
]

export default function EmployeeEmailsPage() {
  const { data: session } = useSession()
  const [templates, setTemplates] = useState<EmailTemplate[]>(defaultTemplates)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedTemplate, setEditedTemplate] = useState<EmailTemplate | null>(null)
  const [previewMode, setPreviewMode] = useState(false)

  // Get sample data for preview
  const activeOrg = session?.memberships?.find(
    (m) => m.organizationId === session.activeOrgId
  )
  const adminName = session?.user?.name || 'Admin'
  const companyName = activeOrg?.organizationName || 'Your Company'
  const employeeName = 'John Doe' // Sample employee name for preview

  const handleEdit = (template: EmailTemplate) => {
    setEditingId(template.id)
    setEditedTemplate({ ...template })
    setPreviewMode(false)
  }

  const handleSave = () => {
    if (editedTemplate) {
      setTemplates(templates.map(t =>
        t.id === editedTemplate.id ? editedTemplate : t
      ))
      setEditingId(null)
      setEditedTemplate(null)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditedTemplate(null)
    setPreviewMode(false)
  }

  const handleReset = (templateId: string) => {
    const defaultTemplate = defaultTemplates.find(t => t.id === templateId)
    if (defaultTemplate) {
      setTemplates(templates.map(t =>
        t.id === templateId ? { ...defaultTemplate } : t
      ))
      if (editingId === templateId) {
        setEditedTemplate({ ...defaultTemplate })
      }
    }
  }

  const populateTemplate = (text: string): string => {
    return text
      .replace(/{employeeName}/g, employeeName)
      .replace(/{adminName}/g, adminName)
      .replace(/{companyName}/g, companyName)
  }

  const currentTemplate = editingId
    ? (editedTemplate || templates.find(t => t.id === editingId))
    : null

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Mail className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">New Employee Email Sequences</h1>
        </div>
        <p className="text-gray-600">
          Customize the automated emails sent to new employees during their onboarding journey.
          Templates support personalization with {'{employeeName}'}, {'{adminName}'}, and {'{companyName}'}.
        </p>
      </div>

      {/* Info Alert */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-medium mb-1">Available Personalization Variables:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><code className="bg-blue-100 px-1 rounded">{'{employeeName}'}</code> - The new employee's name</li>
            <li><code className="bg-blue-100 px-1 rounded">{'{adminName}'}</code> - Your name (currently: {adminName})</li>
            <li><code className="bg-blue-100 px-1 rounded">{'{companyName}'}</code> - Your organization name (currently: {companyName})</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Templates List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Email Templates</h2>
          {templates.map((template) => (
            <div
              key={template.id}
              className={`bg-white border rounded-lg p-5 transition-all ${
                editingId === template.id
                  ? 'border-indigo-500 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{template.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                  <p className="text-xs text-indigo-600 mt-1">Sent on Day {template.dayNumber}</p>
                </div>
                {editingId !== template.id && (
                  <button
                    onClick={() => handleEdit(template)}
                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Subject:</p>
                  <p className="text-sm text-gray-700 font-medium">{template.subject}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Preview:</p>
                  <p className="text-sm text-gray-700 line-clamp-3">{template.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Panel */}
        <div className="lg:sticky lg:top-8 lg:h-fit">
          {editingId && currentTemplate ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {previewMode ? 'Preview' : 'Edit Template'}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {previewMode ? (
                // Preview Mode
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-2">Subject:</p>
                    <p className="text-sm font-medium text-gray-900">
                      {populateTemplate(currentTemplate.subject)}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-2">Email Body:</p>
                    <div className="text-sm text-gray-900 whitespace-pre-wrap">
                      {populateTemplate(currentTemplate.body)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPreviewMode(false)}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Back to Edit
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                // Edit Mode
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Subject
                    </label>
                    <input
                      type="text"
                      value={currentTemplate.subject}
                      onChange={(e) =>
                        setEditedTemplate({ ...currentTemplate, subject: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Body
                    </label>
                    <textarea
                      value={currentTemplate.body}
                      onChange={(e) =>
                        setEditedTemplate({ ...currentTemplate, body: e.target.value })
                      }
                      rows={16}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReset(currentTemplate.id)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Reset to Default
                    </button>
                    <div className="flex-1" />
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                Select an email template to edit or preview
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
