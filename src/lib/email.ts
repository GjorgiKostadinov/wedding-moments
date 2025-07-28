import nodemailer from 'nodemailer'

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

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'spodelim@gmail.com',
    pass: 'rkpw xvmf gezf iktv'
  },
  connectionTimeout: 60000,
  greetingTimeout: 30000,
  socketTimeout: 60000,
})

export async function sendWeddingMoment(data: EmailData) {
  const { weddingTitle, coupleEmail, coupleNames, guestName, message, attachments } = data
  
  console.log('📧 Започнувам да испраќам мејл...')
  console.log('📧 До:', coupleEmail)
  console.log('👤 Од гост:', guestName)
  console.log('📎 Број на прикачувања:', attachments.length)
  
  let totalAttachmentSize = 0
  attachments.forEach((att, i) => {
    const sizeMB = Math.round(att.content.length / 1024 / 1024 * 100) / 100
    totalAttachmentSize += att.content.length
    console.log(`📄 Attachment ${i+1}: ${att.filename} (${sizeMB}MB)`)
  })
  
  const totalMB = Math.round(totalAttachmentSize / 1024 / 1024 * 100) / 100
  console.log(`📊 Вкупен размер: ${totalMB}MB`)
  
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
          <h3 style="color: #333; margin-top: 0; color: #d97706;">📎 Прикачени датотеки (${totalMB}MB):</h3>
          <ul style="color: #666; margin: 0; padding-left: 20px;">
            ${attachments.map(att => {
              const sizeMB = Math.round(att.content.length / 1024 / 1024 * 100) / 100
              return `<li style="margin: 5px 0;">${att.filename} (${sizeMB}MB)</li>`
            }).join('')}
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
    console.log('🚀 Повикувам Gmail...')
    
    const result = await transporter.sendMail({
      from: '"Сподели Моменти" <spodelim@gmail.com>',
      to: coupleEmail,
      subject: `✨ ${guestName} сподели момент од вашиот настан "${weddingTitle}"`,
      html: emailContent,
      attachments: attachments.map(att => ({
        filename: att.filename,
        content: att.content,
        contentType: att.contentType
      }))
    })

    console.log('✅ Gmail одговори успешно')
    console.log('📧 Message ID:', result.messageId)
    
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('💥 Gmail грешка:', error)
    
    let errorMessage = 'Непозната грешка'
    if (error instanceof Error) {
      if (error.message.includes('Message too large')) {
        errorMessage = 'Мејлот е преголем за Gmail (над 25MB)'
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Timeout при испраќање'
      } else {
        errorMessage = error.message
      }
    }
    
    return { success: false, error: errorMessage }
  }
}