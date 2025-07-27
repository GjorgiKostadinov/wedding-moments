import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 'test_key')

export interface EmailData {
  weddingTitle: string
  coupleEmail: string
  coupleNames: string
  guestName: string
  message?: string
  attachments: {
    filename: string
    content: Buffer
    contentType: string
  }[]
}

export async function sendWeddingMoment(data: EmailData) {
  const { weddingTitle, coupleEmail, coupleNames, guestName, message, attachments } = data
  
  console.log('📧 Започнувам да испраќам мејл...')
  console.log('🔑 API Key постои:', !!process.env.RESEND_API_KEY)
  console.log('📧 До:', coupleEmail)
  console.log('👤 Од гост:', guestName)
  console.log('📎 Број на прикачувања:', attachments.length)
  
  // Логирај ги attachments
  attachments.forEach((att, i) => {
    console.log(`📄 Attachment ${i+1}: ${att.filename} (${Math.round(att.content.length/1024)}KB)`)
  })
  
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #d97706, #f59e0b); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Нов момент од вашиот настан!</h1>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-top: 0;">Почитувани ${coupleNames},</h2>
        
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          <strong>${guestName}</strong> сподели прекрасен момент од вашиот настан "${weddingTitle}"!
        </p>
        
        ${message ? `
          <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
            <p style="margin: 0; font-style: italic; color: #555;">
              "${message}"
            </p>
          </div>
        ` : ''}
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
          <h3 style="color: #333; margin-top: 0; color: #d97706;">📎 Прикачени датотеки:</h3>
          <ul style="color: #666; margin: 0; padding-left: 20px;">
            ${attachments.map(att => `<li style="margin: 5px 0;">${att.filename}</li>`).join('')}
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #888; font-size: 14px; margin: 0;">
            Испратено од СподелиМоменти апликацијата<br>
            <span style="color: #d97706; font-weight: 600;">✨ Спомени што траат засекогаш ✨</span>
          </p>
        </div>
      </div>
    </div>
  `

  try {
    console.log('🚀 Повикувам Resend API...')
    console.log('📤 Од email:', process.env.APP_EMAIL)
    console.log('📧 До email:', coupleEmail)
    
    const result = await resend.emails.send({
      from: process.env.APP_EMAIL!,
      to: [coupleEmail],
      subject: `✨ ${guestName} сподели момент од вашиот настан "${weddingTitle}"`,
      html: emailContent,
      attachments: attachments.map(att => ({
        filename: att.filename,
        content: att.content
      }))
    })

    console.log('✅ Resend резултат:', result)
    console.log('📬 Message ID:', result.data?.id)
    console.log('📊 Status:', result.data ? 'УСПЕШНО' : 'ПРОБЛЕМ')
    
    return { success: true, messageId: result.data?.id }
  } catch (error) {
    console.error('💥 Resend грешка:', error)
    console.error('🔍 Детални информации:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack'
    })
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}