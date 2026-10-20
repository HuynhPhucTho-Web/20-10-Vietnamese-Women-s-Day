import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  Heart,
  ArrowDown,
  ArrowUp,
  Sparkles,
  Flower2,
  Gift,
  Send,
  X,
  Volume2,
  VolumeX,
  Share2,
  Check,
  Copy,
  Sun,
  Smile,
  Star,
  Camera,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import './styles.css'

// Direct bundle imports for 100% reliable image resolution
import anh01 from './assets/women_day_webp/anh_01.webp'
import anh02 from './assets/women_day_webp/anh_02.webp'
import anh03 from './assets/women_day_webp/anh_03.webp'
import anh04 from './assets/women_day_webp/anh_04.webp'
import anh05 from './assets/women_day_webp/anh_05.webp'
import anh06 from './assets/women_day_webp/anh_06.webp'

// Motivation / scrollytelling canvas frames (9 images)
import mot01 from './assets/motivation_webp/anh_01.webp'
import mot02 from './assets/motivation_webp/anh_02.webp'
import mot03 from './assets/motivation_webp/anh_03.webp'
import mot04 from './assets/motivation_webp/anh_04.webp'
import mot05 from './assets/motivation_webp/anh_05.webp'
import mot06 from './assets/motivation_webp/anh_06.webp'
import mot07 from './assets/motivation_webp/anh_07.webp'
import mot08 from './assets/motivation_webp/anh_08.webp'
import mot09 from './assets/motivation_webp/anh_09.webp'

const MOTIVATION_FRAMES = [mot01, mot02, mot03, mot04, mot05, mot06, mot07, mot08, mot09]

// Background Music URL
const BG_MUSIC_SRC = '/sound/Chill%20Piano%20Lofi.mp3'

// ==========================================
// 2. FALLING BLOSSOM & BURST CANVAS
// ==========================================
function PetalCanvas({ burstTrigger }) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const burstsRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Create initial gentle falling petals
    const petalColors = ['#ff758f', '#ffb4a2', '#ffccd5', '#ffd166', '#f28482', '#fbb1bd']
    const petalTypes = ['petal', 'heart', 'sparkle']

    const createPetal = () => ({
      x: Math.random() * width,
      y: -20 - Math.random() * height * 0.3,
      size: 10 + Math.random() * 12,
      speedY: 1.2 + Math.random() * 2,
      speedX: -0.8 + Math.random() * 1.6,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.04,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.02 + Math.random() * 0.03,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      opacity: 0.4 + Math.random() * 0.45,
      type: petalTypes[Math.floor(Math.random() * petalTypes.length)],
    })

    particlesRef.current = Array.from({ length: 32 }, createPetal)

    const drawPetal = (p) => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.globalAlpha = p.opacity

      if (p.type === 'heart') {
        ctx.fillStyle = p.color
        ctx.font = `${p.size * 1.2}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('♥', 0, 0)
      } else if (p.type === 'sparkle') {
        ctx.fillStyle = '#ffb703'
        ctx.font = `${p.size}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('✦', 0, 0)
      } else {
        // Draw delicate sakura / rose petal shape
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.ellipse(0, 0, p.size * 0.5, p.size * 0.85, 0, 0, Math.PI * 2)
        ctx.fill()
        // Subtle petal vein
        ctx.strokeStyle = 'rgba(255,255,255,0.45)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(0, -p.size * 0.6)
        ctx.lineTo(0, p.size * 0.6)
        ctx.stroke()
      }
      ctx.restore()
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // 1. Falling ambient petals
      particlesRef.current.forEach((p) => {
        p.sway += p.swaySpeed
        p.x += p.speedX + Math.sin(p.sway) * 0.8
        p.y += p.speedY
        p.rotation += p.rotationSpeed

        if (p.y > height + 30) {
          p.y = -20
          p.x = Math.random() * width
        }
        if (p.x < -30) p.x = width + 20
        if (p.x > width + 30) p.x = -20

        drawPetal(p)
      })

      // 2. Active flower bursts
      for (let i = burstsRef.current.length - 1; i >= 0; i--) {
        const b = burstsRef.current[i]
        b.x += b.vx
        b.y += b.vy
        b.vy += 0.12 // gravity
        b.vx *= 0.98 // air drag
        b.rotation += b.vRot
        b.life -= 0.016
        b.opacity = Math.max(0, b.life)

        if (b.life <= 0) {
          burstsRef.current.splice(i, 1)
        } else {
          drawPetal(b)
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // Listen to burst trigger
  useEffect(() => {
    if (!burstTrigger) return
    const { x, y } = burstTrigger
    const colors = ['#e63968', '#ff758f', '#ffb703', '#ff9ebb', '#f28482', '#fff0f3']
    const newBurstParticles = Array.from({ length: 42 }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = 3.5 + Math.random() * 8.5
      return {
        x: x || window.innerWidth / 2,
        y: y || window.innerHeight / 2,
        size: 12 + Math.random() * 14,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.15,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
        life: 1 + Math.random() * 0.6,
        type: Math.random() > 0.45 ? 'heart' : Math.random() > 0.5 ? 'petal' : 'sparkle',
      }
    })
    burstsRef.current.push(...newBurstParticles)
  }, [burstTrigger])

  return <canvas ref={canvasRef} className="blossom-canvas" aria-hidden="true" />
}

// ==========================================
// 3. MOUSE CURSOR FLOWER TRAIL
// ==========================================
function CursorFlowerTrail() {
  const [trail, setTrail] = useState([])
  const lastPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Only enable on pointer-fine devices (avoid touch spam)
    if (window.matchMedia('(pointer: coarse)').matches) return

    const flowerEmojis = ['🌸', '✨', '💖', '🌷', '🌼', '🌺', '✦']
    const handleMouseMove = (e) => {
      const dx = e.clientX - lastPos.current.x
      const dy = e.clientY - lastPos.current.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist > 30) {
        lastPos.current = { x: e.clientX, y: e.clientY }
        const newFlower = {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
          emoji: flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)],
          size: 16 + Math.floor(Math.random() * 12),
        }
        setTrail((prev) => [...prev.slice(-12), newFlower])
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      {trail.map((item) => (
        <span
          key={item.id}
          className="cursor-flower-item"
          style={{
            left: item.x,
            top: item.y,
            fontSize: `${item.size}px`,
          }}
        >
          {item.emoji}
        </span>
      ))}
    </>
  )
}

// ==========================================
// 4. ANIMATED SWAYING FLOWER MEADOW DIVIDER
// ==========================================
function MeadowDivider() {
  return (
    <div className="meadow-divider" aria-hidden="true">
      <svg className="meadow-svg" viewBox="0 0 1440 90" preserveAspectRatio="none">
        <defs>
          <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7ac78e" />
            <stop offset="100%" stopColor="#43895a" />
          </linearGradient>
        </defs>
        {/* Swaying grass blades */}
        <g fill="url(#grassGrad)">
          {Array.from({ length: 48 }, (_, i) => {
            const x = i * 30 + 10
            const h = 45 + (i % 7) * 6
            return (
              <path
                key={i}
                className="grass-blade"
                d={`M ${x} 90 Q ${x + 6} ${90 - h * 0.6} ${x + (i % 2 === 0 ? 12 : -10)} ${90 - h} Q ${x + 2} ${90 - h * 0.4} ${x + 5} 90 Z`}
                style={{ animationDelay: `${(i % 5) * 0.3}s` }}
              />
            )
          })}
        </g>
        {/* Swaying colorful wildflowers */}
        {Array.from({ length: 24 }, (_, i) => {
          const cx = i * 62 + 25
          const cy = 35 + (i % 4) * 8
          const flowerColors = ['#ff758f', '#ffd166', '#ff9ebb', '#e63968', '#fce2db', '#ffcbf2']
          const color = flowerColors[i % flowerColors.length]
          return (
            <g key={i} className="meadow-flower" style={{ animationDelay: `${(i % 4) * 0.4}s` }}>
              <line x1={cx} y1={90} x2={cx} y2={cy} stroke="#529665" strokeWidth="2.5" />
              {/* Flower petals */}
              <circle cx={cx - 7} cy={cy} r="6" fill={color} opacity="0.9" />
              <circle cx={cx + 7} cy={cy} r="6" fill={color} opacity="0.9" />
              <circle cx={cx} cy={cy - 7} r="6" fill={color} opacity="0.9" />
              <circle cx={cx} cy={cy + 7} r="6" fill={color} opacity="0.9" />
              {/* Pistil */}
              <circle cx={cx} cy={cy} r="5" fill="#ffb703" />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ==========================================
// 5. DATA SETS
// ==========================================
const scrollyChapters = [
  {
    badge: 'Chương 01 · Mầm Xanh Đầu Xuân',
    title: 'Mầm Xanh Tinh Khôi',
    icon: '/images/flaticon_flowers/sprout.png',
    quote: '“Hạnh phúc đến từ sự dịu dàng bạn dành cho chính mình mỗi ngày.”',
    prose:
      'Bắt đầu từ những điều nhỏ nhất, bạn đã mang trong mình sự tươi mới, bình an và ý chí vươn lên dù chưa từng biết trước ngày mai sẽ ra sao.',
  },
  {
    badge: 'Chương 02 · Nụ Cười Mới Nở',
    title: 'Sự Tự Tin Gần Mãi',
    icon: '/images/flaticon_flowers/bloom.png',
    quote: '“Mỗi ngày bạn bước tiếp là một lần tự tin khác đang nở rộ.”',
    prose:
      'Khi nụ cười trở thành thứ ánh lên trong từng khoảnh khắc, bạn đang tràn ngập sức mạnh của một người phụ nữ biết yêu thương bản thân và xứng đáng được yêu thương.',
  },
  {
    badge: 'Chương 03 · Làn Gió Mềm',
    title: 'Dịu Dàng Nhưng Không Yếu Đuối',
    icon: '/images/flaticon_flowers/butterfly.png',
    quote: '“Bạn không cần quá mạnh mới đáng ngưỡng mộ, chỉ cần biết mình đang đứng vững.”',
    prose:
      'Dẫu cuộc sống có đổi thay, sự dịu dàng của bạn vẫn là chỗ dựa ấm áp cho mọi người, khiến mọi nơi bạn đi qua đều cảm thấy bình yên và được yêu thương.',
  },
  {
    badge: 'Chương 04 · Tỏa Sắc Mỗi Ngày',
    title: 'Vươn Lên Rực Rỡ',
    icon: '/images/flaticon_flowers/rose.png',
    quote: '“Không ai có thể xoá đi ánh sáng của bạn, dù trời có mưa.”',
    prose:
      'Bạn là sự kết hợp của nụ cười, nghị lực và phong thái riêng, khiến mỗi ngày đều trở nên sáng hơn nhờ một khí chất dịu mà không kém phần kiêu sa.',
  },
  {
    badge: 'Chương 05 · Chạm Vào Hơi Ấm',
    title: 'Lan Tỏa Hơi Ấm',
    icon: '/images/flaticon_flowers/sunflower.png',
    quote: '“Cái ấm áp của bạn là sự hiện diện ngọt ngào mà cả thế giới cần.”',
    prose:
      'Bạn mang trong mình một nguồn năng lượng chữa lành, biết quan tâm, biết sẻ chia và biết khiến những người quanh mình cảm thấy được ở lại và được yêu thương.',
  },
  {
    badge: 'Chương 06 · Bước Đi Tự Tin',
    title: 'Hương Vị Tự Do',
    icon: '/images/flaticon_flowers/tulip.png',
    quote: '“Bạn đẹp khi dám sống trọn vẹn với riêng mình.”',
    prose:
      'Mỗi bước đi của bạn là một lời khẳng định rằng những gì tốt đẹp nhất không cần được chờ đợi từ ai, mà bắt đầu từ sự tin tưởng vào chính mình.',
  },
  {
    badge: 'Chương 07 · Đêm Thật Bình Yên',
    title: 'Yên Tâm Từng Giây',
    icon: '/images/flaticon_flowers/daisy.png',
    quote: '“Sự bình yên của bạn chính là món quà quý nhất cho cả tâm hồn lẫn cuộc sống.”',
    prose:
      'Dưới ánh đèn dịu, bạn đã học cách chọn sự an nhiên, giữ mình trong trạng thái thanh thản và mang năng lượng tích cực đến từng người xung quanh.',
  },
  {
    badge: 'Chương 08 · Hương Thơm Khó Phai',
    title: 'Những Điều Ngọt Ngào',
    icon: '/images/flaticon_flowers/hydrangea.png',
    quote: '“Đôi khi, điều đẹp nhất là ai đó luôn làm mọi khoảnh khắc trở nên dễ chịu hơn.”',
    prose:
      'Sự hiền hòa, lịch thiệp và tấm lòng rộng mở của bạn để lại hương thơm không chỉ trong tâm trí mà còn trong những ký ức lâu dài của người thân yêu.',
  },
  {
    badge: 'Chương 09 · Tặng Bạn Món Quà',
    title: 'Món Quà Dành Riêng Bạn',
    icon: '/images/flaticon_flowers/bouquet.png',
    quote: '“Hôm nay và mãi mãi về sau, bạn luôn xứng đáng được cả thế giới nâng niu và trân quý.”',
    prose:
      'Chúc mừng ngày 20/10! Xin gửi đến bạn một bó hoa yêu thương được dệt từ biết ơn, khâm phục và hạnh phúc ngập tràn. Hãy luôn rạng rỡ như nụ hoa xinh nhất trong lòng mọi người.',
  },
]

const scrollyFrameStories = [
  {
    badge: 'Khung 01 · Mầm Xanh Đầu Xuân',
    title: 'Mầm Xanh Tinh Khôi',
    quote: '“Hạnh phúc đến từ sự dịu dàng bạn dành cho chính mình mỗi ngày.”',
    prose:
      'Bắt đầu từ những điều nhỏ nhất, bạn đã mang trong mình sự tươi mới, bình an và ý chí vươn lên dù chưa từng biết trước ngày mai sẽ ra sao.',
  },
  {
    badge: 'Khung 02 · Nụ Cười Mới Nở',
    title: 'Sự Tự Tin Gần Mãi',
    quote: '“Mỗi ngày bạn bước tiếp là một lần tự tin khác đang nở rộ.”',
    prose:
      'Khi nụ cười trở thành thứ ánh lên trong từng khoảnh khắc, bạn đang tràn ngập sức mạnh của một người phụ nữ biết yêu thương bản thân và xứng đáng được yêu thương.',
  },
  {
    badge: 'Khung 03 · Làn Gió Mềm',
    title: 'Dịu Dàng Nhưng Không Yếu Đuối',
    quote: '“Bạn không cần quá mạnh mới đáng ngưỡng mộ, chỉ cần biết mình đang đứng vững.”',
    prose:
      'Dẫu cuộc sống có đổi thay, sự dịu dàng của bạn vẫn là chỗ dựa ấm áp cho mọi người, khiến mọi nơi bạn đi qua đều cảm thấy bình yên và được yêu thương.',
  },
  {
    badge: 'Khung 04 · Tỏa Sắc Mỗi Ngày',
    title: 'Vươn Lên Rực Rỡ',
    quote: '“Không ai có thể xoá đi ánh sáng của bạn, dù trời có mưa.”',
    prose:
      'Bạn là sự kết hợp của nụ cười, nghị lực và phong thái riêng, khiến mỗi ngày đều trở nên sáng hơn nhờ một khí chất dịu mà không kém phần kiêu sa.',
  },
  {
    badge: 'Khung 05 · Chạm Vào Hơi Ấm',
    title: 'Lan Tỏa Hơi Ấm',
    quote: '“Cái ấm áp của bạn là sự hiện diện ngọt ngào mà cả thế giới cần.”',
    prose:
      'Bạn mang trong mình một nguồn năng lượng chữa lành, biết quan tâm, biết sẻ chia và biết khiến những người quanh mình cảm thấy được ở lại và được yêu thương.',
  },
  {
    badge: 'Khung 06 · Bước Đi Tự Tin',
    title: 'Hương Vị Tự Do',
    quote: '“Bạn đẹp khi dám sống trọn vẹn với riêng mình.”',
    prose:
      'Mỗi bước đi của bạn là một lời khẳng định rằng những gì tốt đẹp nhất không cần được chờ đợi từ ai, mà bắt đầu từ sự tin tưởng vào chính mình.',
  },
  {
    badge: 'Khung 07 · Đêm Thật Bình Yên',
    title: 'Yên Tâm Từng Giây',
    quote: '“Sự bình yên của bạn chính là món quà quý nhất cho cả tâm hồn lẫn cuộc sống.”',
    prose:
      'Dưới ánh đèn dịu, bạn đã học cách chọn sự an nhiên, giữ mình trong trạng thái thanh thản và mang năng lượng tích cực đến từng người xung quanh.',
  },
  {
    badge: 'Khung 08 · Hương Thơm Khó Phai',
    title: 'Những Điều Ngọt Ngào',
    quote: '“Đôi khi, điều đẹp nhất là ai đó luôn làm mọi khoảnh khắc trở nên dễ chịu hơn.”',
    prose:
      'Sự hiền hòa, lịch thiệp và tấm lòng rộng mở của bạn để lại hương thơm không chỉ trong tâm trí mà còn trong những ký ức lâu dài của người thân yêu.',
  },
  {
    badge: 'Khung 09 · Tặng Bạn Món Quà',
    title: 'Món Quà Dành Riêng Bạn',
    quote: '“Hôm nay và mãi mãi về sau, bạn luôn xứng đáng được cả thế giới nâng niu và trân quý.”',
    prose:
      'Chúc mừng ngày 20/10! Xin gửi đến bạn một bó hoa yêu thương được dệt từ biết ơn, khâm phục và hạnh phúc ngập tràn. Hãy luôn rạng rỡ như nụ hoa xinh nhất trong lòng mọi người.',
  },
]

const flowerGardenData = [
  {
    name: 'Hoa Hồng Đỏ',
    icon: '/images/flaticon_flowers/rose.png',
    meaning: 'Tình Yêu Nồng Nàn & Bản Lĩnh',
    desc: 'Đại diện cho vẻ đẹp quyến rũ, kiêu hãnh và trái tim luôn nồng cháy đam mê.',
    wish: 'Chúc bạn luôn giữ trọn ngọn lửa nhiệt huyết, xinh đẹp kiêu sa và được yêu thương đắm say!',
  },
  {
    name: 'Hoa Tulip Hồng',
    icon: '/images/flaticon_flowers/tulip.png',
    meaning: 'Dịu Dàng & Thanh Lịch',
    desc: 'Biểu tượng của sự tinh tế, quý phái và những khởi đầu ngập tràn may mắn.',
    wish: 'Chúc bạn luôn giữ trọn nét thanh tao, tâm hồn an yên và mỗi ngày đều nở rộ nụ cười xinh!',
  },
  {
    name: 'Hoa Hướng Dương',
    icon: '/images/flaticon_flowers/sunflower.png',
    meaning: 'Năng Lượng Tích Cực',
    desc: 'Luôn hướng về ánh mặt trời, tượng trưng cho sức sống mãnh liệt và lòng ấm áp.',
    wish: 'Chúc bạn luôn tỏa sáng rực rỡ như nắng ban mai, lan tỏa niềm vui và hy vọng đến muôn nơi!',
  },
  {
    name: 'Hoa Anh Đào',
    icon: '/images/flaticon_flowers/sakura.png',
    meaning: 'Thuần Khiết & Thanh Xuân',
    desc: 'Mang vẻ đẹp mong manh nhưng đầy sức sống của mùa xuân tươi mới.',
    wish: 'Chúc bạn mãi giữ được trái tim hồn nhiên, nụ cười trong trẻo và nét thanh xuân vĩnh cửu!',
  },
  {
    name: 'Hoa Cúc Họa Mi',
    icon: '/images/flaticon_flowers/daisy.png',
    meaning: 'Bình Yên & Chân Thành',
    desc: 'Những cánh hoa trắng nhỏ nhắn nhắc ta về những điều giản dị và ngọt ngào nhất.',
    wish: 'Chúc bạn những ngày thảnh thơi an lành, một tách trà thơm và ngập tràn sự bình yên trong tâm hồn!',
  },
  {
    name: 'Hoa Cẩm Tú Cầu',
    icon: '/images/flaticon_flowers/hydrangea.png',
    meaning: 'Lòng Biết Ơn & Viên Mãn',
    desc: 'Từng cánh hoa kết lại thành khối cầu tròn đầy, tượng trưng cho hạnh phúc vẹn tròn.',
    wish: 'Cảm ơn vì bạn đã luôn hiện diện và mang đến vạn điều tốt lành. Chúc bạn một đời viên mãn hạnh phúc!',
  },
]

const polaroidPhotos = [
  {
    id: 1,
    img: anh01,
    fallback: '/images/women_day_webp/anh_01.webp',
    note: 'Nụ cười rạng rỡ như đóa hồng mai',
    likes: 238,
  },
  {
    id: 2,
    img: anh02,
    fallback: '/images/women_day_webp/anh_02.webp',
    note: 'Nét đẹp dịu dàng và thanh lịch',
    likes: 312,
  },
  {
    id: 3,
    img: anh03,
    fallback: '/images/women_day_webp/anh_03.webp',
    note: 'Tự tin tỏa sáng theo cách riêng',
    likes: 275,
  },
  {
    id: 4,
    img: anh04,
    fallback: '/images/women_day_webp/anh_04.webp',
    note: 'Khoảnh khắc an yên và ngọt ngào',
    likes: 340,
  },
  {
    id: 5,
    img: anh05,
    fallback: '/images/women_day_webp/anh_05.webp',
    note: 'Ngập tràn yêu thương và hạnh phúc',
    likes: 289,
  },
  {
    id: 6,
    img: anh06,
    fallback: '/images/women_day_webp/anh_06.webp',
    note: 'Xinh đẹp kiêu hãnh một ngày 20/10',
    likes: 365,
  },
]

const wishesSpecial = [
  {
    icon: '/images/flaticon_flowers/tulip.png',
    theme: 'wish-theme-1',
    num: '01 / YÊU THƯƠNG',
    title: 'Gửi Mẹ Kính Yêu',
    text: 'Cảm ơn Mẹ vì cả đời tần tảo, hy sinh thầm lặng. Mong Mẹ luôn dồi dào sức khỏe, an yên và mỗi ngày đều tràn ngập nụ cười.',
  },
  {
    icon: '/images/flaticon_flowers/rose.png',
    theme: 'wish-theme-2',
    num: '02 / CHÂN THÀNH',
    title: 'Gửi Người Thương',
    text: 'Cảm ơn em vì đã đến và làm thế giới của anh trở nên dịu dàng hơn bao giờ hết. Chúc em ngày 20/10 ngập tràn niềm vui và hạnh phúc.',
  },
  {
    icon: '/images/flaticon_flowers/sakura.png',
    theme: 'wish-theme-3',
    num: '03 / TRI KỶ',
    title: 'Gửi Bạn Thân',
    text: 'Chúc bạn tôi luôn giữ vững ngọn lửa tự tin, làm được những điều mình hằng mơ ước và luôn có những người yêu thương cạnh bên.',
  },
  {
    icon: '/images/flaticon_flowers/sunflower.png',
    theme: 'wish-theme-4',
    num: '04 / TÔN VINH',
    title: 'Những Cô Gái Tuyệt Vời',
    text: 'Bạn là một cá thể độc bản, xinh đẹp và tỏa sáng theo cách của riêng mình. Hãy luôn kiêu hãnh và yêu thương chính bản thân.',
  },
]

const presetWishList = [
  'Chúc bạn ngày 20/10 thật nhiều niềm vui, luôn rạng rỡ như đóa hoa hướng dương và hạnh phúc trọn vẹn bên người thân yêu!',
  'Cảm ơn bạn vì đã luôn là điều dịu dàng và ấm áp nhất trong thế giới này. Chúc bạn một ngày 20/10 ngập tràn hoa tươi và quà tặng!',
  'Chúc người phụ nữ tuyệt vời nhất luôn giữ mãi nụ cười trên môi, bình an trong tâm hồn và gặp vạn sự may mắn!',
  'Nhân ngày 20/10, mong mọi điều ngọt ngào nhất sẽ tìm đến bạn. Hãy luôn tự tin tỏa sáng theo cách riêng của mình nhé!',
  'Gửi đến bạn ngàn đóa hoa tươi thắm cùng tất cả sự trân trọng chân thành nhất. Chúc bạn một ngày 20/10 thật đáng nhớ!',
]

// ==========================================
// 6. SCROLL IMAGE SEQUENCE (Pinned & Frame-Locked Canvas)
// ==========================================
function ScrollImageSequence({
  frames,
  chapters,
  activeChapter,
  onChapterChange,
  onBurst,
  onOpenLetter,
  setCustomWish
}) {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const imagesRef = useRef([])
  const frameIdxRef = useRef(0)
  const [frameIdx, setFrameIdx] = useState(0)
  const [canvasReady, setCanvasReady] = useState(false)
  const deltaAccumulatorRef = useRef(0)

  // Draw current frame to canvas cleanly without any flicker
  const drawFrame = useCallback((idx) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const img = imagesRef.current[idx]
    if (!img || !img.complete || !img.naturalWidth) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const w = rect.width || canvas.offsetWidth || 400
    const h = rect.height || canvas.offsetHeight || 380

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const targetW = Math.round(w * dpr)
    const targetH = Math.round(h * dpr)

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW
      canvas.height = targetH
    }

    const cw = canvas.width
    const ch = canvas.height
    const iw = img.naturalWidth
    const ih = img.naturalHeight

    // Cover-fit math
    const scale = Math.max(cw / iw, ch / ih)
    const dx = (cw - iw * scale) / 2
    const dy = (ch - ih * scale) / 2

    // Direct draw (no clearRect so zero flicker)
    ctx.drawImage(img, dx, dy, iw * scale, ih * scale)
    setCanvasReady(true)
  }, [])

  // Update active frame and map to chapter
  const goToFrame = useCallback((targetIdx) => {
    const bounded = Math.max(0, Math.min(frames.length - 1, targetIdx))
    frameIdxRef.current = bounded
    setFrameIdx(bounded)
    drawFrame(bounded)
    const chapIdx = Math.min(chapters.length - 1, Math.floor((bounded / frames.length) * chapters.length))
    onChapterChange(chapIdx)
  }, [frames.length, chapters.length, drawFrame, onChapterChange])

  // Preload all frames eagerly on mount
  useEffect(() => {
    let isMounted = true
    const loaded = []

    frames.forEach((src, i) => {
      const img = new window.Image()
      img.src = src
      img.onload = () => {
        if (!isMounted) return
        if (i === frameIdxRef.current) {
          drawFrame(i)
        }
      }
      loaded[i] = img
    })

    imagesRef.current = loaded

    const t = setTimeout(() => {
      if (isMounted) drawFrame(0)
    }, 60)

    const handleResize = () => drawFrame(frameIdxRef.current)
    window.addEventListener('resize', handleResize)

    return () => {
      isMounted = false
      clearTimeout(t)
      window.removeEventListener('resize', handleResize)
    }
  }, [frames, drawFrame])

  // Wheel lock: hold user on this section while cycling through all 9 frames
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const WHEEL_THRESHOLD = 70 // wheel delta required to advance 1 frame

    const handleWheel = (e) => {
      const rect = section.getBoundingClientRect()
      // Active when section top is at or past viewport top, and section hasn't scrolled past bottom
      const isPinnedInView = rect.top <= 20 && rect.bottom >= window.innerHeight - 20

      if (!isPinnedInView) return

      // Once the final frame is reached, let the browser scroll normally to the next section.
      if (frameIdxRef.current >= frames.length - 1 && e.deltaY > 0) {
        return
      }

      // Scrolling DOWN
      if (e.deltaY > 0) {
        if (frameIdxRef.current < frames.length - 1) {
          // Still have frames to show -> prevent page scrolling down!
          e.preventDefault()
          deltaAccumulatorRef.current += e.deltaY
          if (deltaAccumulatorRef.current >= WHEEL_THRESHOLD) {
            deltaAccumulatorRef.current = 0
            goToFrame(frameIdxRef.current + 1)
          }
        }
      }
      // Scrolling UP
      else if (e.deltaY < 0) {
        if (frameIdxRef.current > 0) {
          // Still in sequence -> prevent page scrolling up!
          e.preventDefault()
          deltaAccumulatorRef.current += e.deltaY
          if (deltaAccumulatorRef.current <= -WHEEL_THRESHOLD) {
            deltaAccumulatorRef.current = 0
            goToFrame(frameIdxRef.current - 1)
          }
        }
        // If frameIdxRef.current === 0, allow scrolling back up to hero!
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [frames.length, goToFrame])

  // Keep the sequence under wheel control only. The global scroll-sync backup was
  // causing the last-frame jump to overshoot and skip ahead unexpectedly.

  const handleSelectChapter = (chapIdx) => {
    onChapterChange(chapIdx)
    const targetFrame = Math.floor((chapIdx / chapters.length) * frames.length)
    goToFrame(targetFrame)
    onBurst()
  }

  const chap = chapters[activeChapter] || chapters[0]
  const currentStory = chapters[frameIdx] || chapters[0]

  return (
    <section className="scrolly-section" id="scrolly-story" ref={sectionRef}>
      <div className="scrolly-sticky-box">
        {/* Section Header */}
        <div className="section-header scrolly-header">
          <h2 className="section-title">
            Bốn Mùa Dịu Dàng<br />
            <em>Nhật Ký Đóa Hoa Tỏa Sắc</em>
          </h2>
          <p className="section-subtitle">
            Cuộn chuột để chiêm ngưỡng trọn vẹn 9 khoảnh khắc rạng ngời (khung hình tự khóa cho đến khi xem hết).
          </p>
        </div>

        {/* Milestone Selector Tabs */}
        <div className="scrolly-milestones">
          {chapters.map((c, idx) => (
            <button
              key={c.title}
              className={`milestone-btn ${activeChapter === idx ? 'active' : ''}`}
              onClick={() => handleSelectChapter(idx)}
            >
              <img src={c.icon} alt={c.title} className="milestone-flaticon" />
              <span>Chương 0{idx + 1}</span>
            </button>
          ))}
        </div>

        {/* Scrolly Card */}
        <div className="scrolly-card">
          {/* Visual Stage: Canvas Image Sequence */}
          <div className="scrolly-canvas-stage">
            <canvas ref={canvasRef} className="scrolly-sequence-canvas" />

            {/* Fallback image layer so it is NEVER blank */}
            <img
              src={frames[frameIdx]}
              alt="Khoảnh khắc"
              className="scrolly-canvas-fallback"
              style={{ opacity: canvasReady ? 0 : 1 }}
            />

            {/* Current Frame Pill */}
            <div className="scrolly-frame-badge">
              <Sparkles size={13} color="#e63968" />
              <span>Khoảnh khắc {frameIdx + 1} / {frames.length}</span>
            </div>

            {/* Clickable Dots inside Canvas */}
            <div className="scrolly-canvas-dots">
              {frames.map((_, i) => (
                <span
                  key={i}
                  className={`scrolly-canvas-dot ${i === frameIdx ? 'active' : ''}`}
                  onClick={() => goToFrame(i)}
                  title={`Xem ảnh ${i + 1}`}
                />
              ))}
            </div>

            {/* Progress bar along the bottom of the canvas */}
            <div className="scrolly-frame-progress">
              <div
                className="scrolly-frame-progress-bar"
                style={{ width: `${((frameIdx + 1) / frames.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Story Content Panel - Continuous smooth crossfade without disappearing */}
          <div className="scrolly-content">
            <motion.div
              key={`${activeChapter}-${frameIdx}`}
              initial={{ opacity: 0.35, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <span className="scrolly-stage-badge">
                {currentStory.badge}
              </span>
              <h3>{currentStory.title}</h3>
              <p className="scrolly-prose">{currentStory.prose}</p>

              <div className="scrolly-quote-box">
                {currentStory.quote}
              </div>
            </motion.div>

            {/* Navigation and Actions */}
            <div className="scrolly-nav-arrows">
              {/* Prev / Next Frame Buttons */}
              <button
                className="scrolly-arrow-btn"
                onClick={() => goToFrame(frameIdx - 1)}
                disabled={frameIdx === 0}
                title="Khoảnh khắc trước"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                className="scrolly-arrow-btn"
                onClick={() => goToFrame(frameIdx + 1)}
                disabled={frameIdx === frames.length - 1}
                title="Khoảnh khắc tiếp theo"
              >
                <ChevronRight size={18} />
              </button>

              {/* Status indicator */}
              <div className="scrolly-scroll-indicator">
                <ArrowDown size={15} className="scroll-arrow-anim" />
                <span>Cuộn chuột ({frameIdx + 1}/{frames.length})</span>
              </div>

              <button
                className="btn btn-primary"
                style={{ marginLeft: 'auto' }}
                onClick={(e) => {
                  onBurst(e)
                  setCustomWish(currentStory.quote.replace(/[“”]/g, ''))
                  onOpenLetter()
                }}
              >
                Lấy lời chúc này <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
// ==========================================
// 7. MAIN APPLICATION COMPONENT
// ==========================================
function App() {
  const audioRef = useRef(null)
  const [isPlayingMusic, setIsPlayingMusic] = useState(false)
  const [burstTrigger, setBurstTrigger] = useState(null)
  const [activeChapter, setActiveChapter] = useState(0)
  const [selectedFlower, setSelectedFlower] = useState(null)
  const [lightboxImg, setLightboxImg] = useState(null)
  const [letterModalOpen, setLetterModalOpen] = useState(false)

  // Initialize and auto-play background music
  useEffect(() => {
    const audio = new Audio(BG_MUSIC_SRC)
    audio.loop = true
    audio.volume = 0.6
    audioRef.current = audio

    const cleanupListeners = () => {
      window.removeEventListener('click', onUserInteraction)
      window.removeEventListener('scroll', onUserInteraction)
      window.removeEventListener('touchstart', onUserInteraction)
      window.removeEventListener('keydown', onUserInteraction)
    }

    const onUserInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setIsPlayingMusic(true)
          cleanupListeners()
        }).catch(() => {})
      }
    }

    // 1. Try immediate autoplay
    audio.play().then(() => {
      setIsPlayingMusic(true)
    }).catch(() => {
      // 2. Browser policy blocked autoplay before user interaction:
      // Listen for the first touch/click/scroll/keypress to smoothly start music!
      window.addEventListener('click', onUserInteraction, { once: true, passive: true })
      window.addEventListener('scroll', onUserInteraction, { once: true, passive: true })
      window.addEventListener('touchstart', onUserInteraction, { once: true, passive: true })
      window.addEventListener('keydown', onUserInteraction, { once: true, passive: true })
    })

    return () => {
      cleanupListeners()
      audio.pause()
      audio.src = ''
    }
  }, [])

  // Card Modal State
  const [recipient, setRecipient] = useState('Người thương')
  const [sender, setSender] = useState('Từ một người luôn mến thương bạn')
  const [customWish, setCustomWish] = useState(presetWishList[0])
  const [cardTheme, setCardTheme] = useState('rose')
  const [copied, setCopied] = useState(false)

  // Photo Likes State
  const [likesMap, setLikesMap] = useState({ 1: 238, 2: 312, 3: 275, 4: 340, 5: 289, 6: 365 })

  const { scrollYProgress } = useScroll()
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const triggerBurst = (e) => {
    const x = e?.clientX || window.innerWidth / 2
    const y = e?.clientY || window.innerHeight / 2
    setBurstTrigger({ x, y, time: Date.now() })
  }

  const toggleMusic = () => {
    if (!audioRef.current) return
    if (isPlayingMusic) {
      audioRef.current.pause()
      setIsPlayingMusic(false)
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true)
      }).catch(() => {})
    }
  }

  const [heartPops, setHeartPops] = useState([])

  const handleLike = (id, e) => {
    e.stopPropagation()
    setLikesMap((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
    triggerBurst(e)

    // Add floating hearts popping directly from the button
    const emojis = ['💖', '💕', '🌸', '✨', '+1']
    const newPop = {
      id: Date.now() + Math.random(),
      photoId: id,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: 35 + Math.random() * 30,
    }
    setHeartPops((prev) => [...prev.slice(-12), newPop])
  }

  const handleCopyWish = () => {
    const textToCopy = `Thân gửi ${recipient},\n\n${customWish}\n\n— ${sender} ♡\nChúc mừng ngày Phụ Nữ Việt Nam 20/10! 🌸`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2400)
      })
    }
  }

  const handleShareWish = () => {
    const textToShare = `Thân gửi ${recipient},\n\n${customWish}\n\n— ${sender} ♡\nChúc mừng ngày Phụ Nữ Việt Nam 20/10! 🌸`
    if (navigator.share) {
      navigator.share({
        title: 'Lời chúc 20/10 Yêu Thương',
        text: textToShare,
        url: window.location.href,
      }).catch(() => {})
    } else {
      handleCopyWish()
    }
  }

  return (
    <main>
      {/* Scroll Progress Bar */}
      <motion.div className="scroll-progress" style={{ scaleX: progressScale }} />

      {/* Falling Blossom & Confetti Canvas */}
      <PetalCanvas burstTrigger={burstTrigger} />

      {/* Mouse Flower Trail */}
      <CursorFlowerTrail />

      {/* TOP NAVIGATION BAR */}
      <nav className="topbar">
        <a className="brand" href="#home" onClick={(e) => { e.preventDefault(); scrollTo('home'); }}>
          <span className="brand-mark"><Heart size={18} fill="currentColor" /></span>
          <span>Gửi Yêu Thương · 20/10</span>
        </a>

        <div className="topbar-actions">
          <div className="nav-date-badge">
            <Sparkles size={14} color="#e63968" />
            <span>20 · 10 · 2026</span>
          </div>

          <button
            className="music-toggle-btn"
            onClick={toggleMusic}
            title={isPlayingMusic ? 'Tạm dừng nhạc Chill Piano Lofi' : 'Bật nhạc Chill Piano Lofi'}
          >
            {isPlayingMusic ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{isPlayingMusic ? 'Chill Piano Lofi' : 'Bật nhạc'}</span>
            {isPlayingMusic && (
              <div className="music-equalizer">
                <span className="equalizer-bar" />
                <span className="equalizer-bar" />
                <span className="equalizer-bar" />
                <span className="equalizer-bar" />
              </div>
            )}
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero" id="home">
        <div className="hero-glow-bg glow-a" />
        <div className="hero-glow-bg glow-b" />

        <div className="hero-copy">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="eyebrow"
          >
            <Sparkles size={15} /> Tôn vinh Ngày Phụ Nữ Việt Nam
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            Gửi ngàn đóa hoa<br />
            <em>Rực Rỡ & Dịu Dàng</em><br />
            trao bạn <span className="hero-date-highlight">20·10</span>
          </motion.h1>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            Cảm ơn vì bạn đã luôn là điều tuyệt diệu nhất trong cuộc sống này.
            Chúc bạn luôn ngập tràn niềm vui, tự tin tỏa sáng rực rỡ và luôn được yêu thương theo cách trọn vẹn nhất.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <button className="btn btn-primary" onClick={() => scrollTo('scrolly-story')}>
              Khám phá món quà <Flower2 size={17} />
            </button>

            <button className="btn btn-burst" onClick={triggerBurst}>
              Tung hoa & Thả tim <Heart size={16} fill="#e63968" color="#e63968" />
            </button>

            <button className="btn btn-secondary" onClick={() => setLetterModalOpen(true)}>
              Viết thiệp riêng <Send size={15} />
            </button>
          </motion.div>

          <div
            className="scroll-cue"
            onClick={() => scrollTo('scrolly-story')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && scrollTo('scrolly-story')}
          >
            <span>Cuộn xuống cùng lắng nghe câu chuyện</span>
            <ArrowDown size={16} />
          </div>
        </div>

        {/* HERO ARTWORK SHOWCASE */}
        <motion.div
          className="hero-art-container"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="hero-art-halo" />

          <div className="hero-portrait-frame">
            <img
              src="/images/design-concept-20-10.png"
              alt="Chào mừng ngày Phụ Nữ Việt Nam 20/10"
              className="hero-portrait-image"
            />

            {/* Floating interactive badges */}
            <div className="floating-badge badge-a">
              <img src="/images/flaticon_flowers/sakura.png" alt="20/10 Rạng Rỡ" className="badge-flaticon-icon" />
              <span>20/10 Rạng Rỡ</span>
            </div>

            <div className="floating-badge badge-b">
              <img src="/images/flaticon_flowers/heart.png" alt="Dịu Dàng Yêu Thương" className="badge-flaticon-icon" />
              <span>Dịu Dàng Yêu Thương</span>
            </div>

            <div className="floating-badge badge-c">
              <img src="/images/flaticon_flowers/tulip.png" alt="Luôn Hạnh Phúc Nhé!" className="badge-flaticon-icon" />
              <span>Luôn Hạnh Phúc Nhé!</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SWAYING FLOWER MEADOW DIVIDER */}
      <MeadowDivider />

      {/* ===================================================
          SCROLLYTELLING: BỐN MÙA NỞ HOA (CANVAS SEQUENCE)
          =================================================== */}
      <ScrollImageSequence
        frames={MOTIVATION_FRAMES}
        chapters={scrollyChapters}
        activeChapter={activeChapter}
        onChapterChange={setActiveChapter}
        onBurst={triggerBurst}
        onOpenLetter={() => setLetterModalOpen(true)}
        setCustomWish={setCustomWish}
      />

      {/* ===================================================
          VƯỜN HOA THÔNG ĐIỆP (PICK A FLOWER)
          =================================================== */}
      <section className="section-pad flower-garden-section" id="garden">
        <div className="section-header">
          <span className="section-kicker"><Flower2 size={16} /> Vườn Hoa Ước Nguyện</span>
          <h2 className="section-title">
            Chọn Một Đóa Hoa<br />
            <em>Nhận Thông Điệp Dành Riêng Bạn</em>
          </h2>
          <p className="section-subtitle">
            Mỗi bông hoa mang một ngôn ngữ dịu dàng riêng. Hãy chạm vào đóa hoa bạn yêu thích để mở khóa lời chúc ấm áp nhất.
          </p>
        </div>

        <div className="flower-grid">
          {flowerGardenData.map((f, i) => (
            <motion.div
              key={f.name}
              className="flower-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              onClick={(e) => {
                triggerBurst(e)
                setSelectedFlower(f)
              }}
            >
              <div className="flower-icon-wrap">
                <img src={f.icon} alt={f.name} className="flower-flaticon-img" />
              </div>
              <h4>{f.name}</h4>
              <span className="flower-card-meaning">{f.meaning}</span>
              <p>{f.desc}</p>
              <div className="flower-card-action">
                <span>Mở thông điệp</span>
                <Sparkles size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===================================================
          GÓC KHOẢNH KHẮC DỊU DÀNG (POLAROID MEMORY GALLERY)
          =================================================== */}
      <section className="section-pad gallery-section" id="gallery">
        <div className="section-header">
          <span className="section-kicker"><Camera size={16} /> Góc Kỷ Niệm Thơ Mộng</span>
          <h2 className="section-title">
            Những Khoảnh Khắc<br />
            <em>Đẹp Như Giấc Mơ</em>
          </h2>
          <p className="section-subtitle">
            Hoa cỏ khoe sắc dưới ánh nắng ban mai, góc trà thơm dịu êm và nụ cười rạng rỡ của bạn là những điều đẹp nhất.
          </p>
        </div>

        <div className="polaroid-grid">
          {polaroidPhotos.map((photo, i) => {
            const rot = i % 2 === 0 ? -2.5 + (i * 1.2) : 2.5 - (i * 0.8)
            return (
              <motion.div
                key={photo.id}
                className="polaroid-item"
                style={{ transform: `rotate(${rot}deg)` }}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ rotate: 0, scale: 1.03, y: -6 }}
                onClick={() => setLightboxImg(photo)}
              >
                <div className="polaroid-tape" />
                <div className="polaroid-img-wrap">
                  <img
                    src={photo.img}
                    alt={photo.note}
                    className="polaroid-img"
                    loading="eager"
                    onError={(e) => {
                      if (photo.fallback && e.target.src !== photo.fallback) {
                        e.target.src = photo.fallback
                      }
                    }}
                  />
                </div>
                <div className="polaroid-caption">
                  <span className="polaroid-note">{photo.note}</span>
                  <button
                    className="polaroid-heart-btn"
                    onClick={(e) => handleLike(photo.id, e)}
                    title="Thả tim cho khoảnh khắc này"
                  >
                    <Heart size={14} fill="currentColor" />
                    <span>{likesMap[photo.id]}</span>
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ===================================================
          DÀNH CHO NGƯỜI ĐẶC BIỆT & TRÁI TIM TRĂM HOA
          =================================================== */}
      <section className="section-pad wishes-section" id="special">
        <div className="section-header">
          <span className="section-kicker"><Heart size={16} /> Lời Nhắn Yêu Thương</span>
          <h2 className="section-title">
            Dành Cho Những Người<br />
            <em>Phụ Nữ Tuyệt Vời Nhất</em>
          </h2>
          <p className="section-subtitle">
            Mỗi người phụ nữ là một món quà vô giá của thế gian. Hãy gửi trao sự biết ơn và trân trọng sâu sắc nhất.
          </p>
        </div>

        <div className="wish-grid-4">
          {wishesSpecial.map((w, idx) => (
            <motion.div
              key={w.title}
              className="wish-box"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <div className={`wish-box-header ${w.theme}`}>
                <img src={w.icon} alt={w.title} className="wish-flaticon-img" />
              </div>
              <div className="wish-box-body">
                <span className="wish-box-num">{w.num}</span>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Blooming Heart Affirmations */}
        <div className="heart-story-container">
          <div className="heart-center-visual">
            <div className="blooming-heart-canvas-wrap">
              <div className="heart-ring-flowers">
                {Array.from({ length: 12 }, (_, i) => {
                  const angle = (i * 30 * Math.PI) / 180
                  const r = 95
                  const x = 120 + Math.cos(angle) * r - 13
                  const y = 120 + Math.sin(angle) * r - 13
                  const flaticonList = [
                    '/images/flaticon_flowers/rose.png',
                    '/images/flaticon_flowers/tulip.png',
                    '/images/flaticon_flowers/daisy.png',
                    '/images/flaticon_flowers/sakura.png',
                    '/images/flaticon_flowers/sunflower.png',
                    '/images/flaticon_flowers/bloom.png',
                  ]
                  return (
                    <img
                      key={i}
                      src={flaticonList[i % flaticonList.length]}
                      alt="Hoa xoay"
                      className="heart-flower-dot orbit-flaticon-icon"
                      style={{ left: `${x}px`, top: `${y}px` }}
                    />
                  )
                })}
              </div>
              <Heart className="pulsing-heart-icon" fill="#e63968" />
            </div>
            <div style={{ marginTop: '16px', fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--color-rose-deep)', fontSize: '18px' }}>
              Một trái tim luôn hướng về bạn ♡
            </div>
          </div>

          <div className="affirmation-list">
            <h3><Sparkles size={22} color="#e63968" /> Lời chúc lành gửi đến bạn</h3>
            {[
              'Luôn xinh đẹp, rạng rỡ và dịu dàng theo cách riêng',
              'Thân tâm an lạc, dồi dào sức khỏe và bình an mỗi ngày',
              'Tự tin bước đi trên con đường theo đuổi ước mơ',
              'Luôn gặp được những tâm hồn chân thành và trân quý bạn',
              'Được yêu thương sâu sắc, hôm nay và mãi mãi về sau',
            ].map((text, i) => (
              <motion.div
                key={text}
                className="affirmation-item"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Heart size={16} fill="currentColor" />
                <span>{text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-flaticon-row">
          {['rose.png', 'tulip.png', 'daisy.png', 'sunflower.png', 'sakura.png', 'hydrangea.png'].map((f, i) => (
            <img
              key={f}
              src={`/images/flaticon_flowers/${f}`}
              alt="Hoa chúc mừng"
              className="footer-flaticon-img"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
        <h2><em>Phụ Nữ Là Để Yêu Thương</em> ♡</h2>
        <p>
          Kính chúc toàn thể Phụ Nữ Việt Nam một ngày 20/10 ngập tràn hoa thơm, tiếng cười và hạnh phúc viên mãn.
        </p>

        <div className="footer-signoff" aria-label="Chữ ký người gửi">
          <span>Huỳnh Phúc Thọ</span>
          <span className="footer-signoff-sep">•</span>
          <span>Trân Trọng Gửi Tặng</span>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '22px' }}>
          <button className="btn btn-primary" onClick={() => setLetterModalOpen(true)}>
            Gửi thiệp chúc mừng <Send size={15} />
          </button>
          <button className="btn btn-burst" onClick={triggerBurst}>
            Bắn pháo hoa nở rộ ✨
          </button>
        </div>

        <button className="back-to-top-btn" onClick={() => scrollTo('home')}>
          <span>Trở về đầu trang</span>
          <ArrowUp size={15} />
        </button>
      </footer>

      {/* ===================================================
          MODAL: CHI TIẾT THÔNG ĐIỆP HOA
          =================================================== */}
      <AnimatePresence>
        {selectedFlower && (
          <div
            className="modal-backdrop"
            role="presentation"
            onClick={() => setSelectedFlower(null)}
          >
            <motion.div
              className="card-modal"
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close-btn"
                onClick={() => setSelectedFlower(null)}
                aria-label="Đóng"
              >
                <X size={18} />
              </button>

              <img
                src={selectedFlower.icon}
                alt={selectedFlower.name}
                className="modal-flower-flaticon-img"
              />
              <div style={{ textAlign: 'center' }}>
                <span className="modal-badge">Ý nghĩa đóa hoa</span>
                <h2>{selectedFlower.name}</h2>
                <div style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '15px', marginBottom: '16px' }}>
                  {selectedFlower.meaning}
                </div>
              </div>

              <div className="card-preview-container">
                <span className="card-preview-corner corner-tl">
                  <img src="/images/flaticon_flowers/bloom.png" alt="" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                </span>
                <span className="card-preview-corner corner-br">
                  <img src="/images/flaticon_flowers/sakura.png" alt="" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                </span>
                <div className="preview-body">
                  {selectedFlower.wish}
                </div>
                <div className="preview-footer">
                  <span>Chúc mừng ngày 20/10 ♡</span>
                  <img src={selectedFlower.icon} alt="" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                </div>
              </div>

              <div className="modal-action-row">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setCustomWish(selectedFlower.wish)
                    setSelectedFlower(null)
                    setLetterModalOpen(true)
                  }}
                >
                  Dùng lời chúc này viết thiệp <Send size={15} />
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(selectedFlower.wish)
                      alert('Đã sao chép lời chúc của loài hoa này!')
                    }
                  }}
                >
                  Sao chép <Copy size={15} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================
          MODAL: TẤM THIỆP & LỜI CHÚC CÁ NHÂN HÓA
          =================================================== */}
      <AnimatePresence>
        {letterModalOpen && (
          <div
            className="modal-backdrop"
            role="presentation"
            onClick={() => setLetterModalOpen(false)}
          >
            <motion.div
              className="card-modal"
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close-btn"
                onClick={() => setLetterModalOpen(false)}
                aria-label="Đóng"
              >
                <X size={18} />
              </button>

              <div style={{ textAlign: 'center' }}>
                <span className="modal-badge"><Sparkles size={14} /> Tự tay thiết kế</span>
                <h2>Thiệp Chúc Mừng 20/10</h2>
              </div>

              {/* Recipient Quick Chips */}
              <div className="form-group">
                <label>Người nhận:</label>
                <div className="recipient-chips">
                  {['Mẹ yêu', 'Vợ yêu', 'Người thương', 'Bạn thân', 'Chị gái', 'Cô giáo', 'Đồng nghiệp'].map((r) => (
                    <button
                      key={r}
                      className={`chip-btn ${recipient === r ? 'active' : ''}`}
                      onClick={() => setRecipient(r)}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <input
                  className="form-input"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Nhập tên người bạn muốn gửi..."
                  maxLength={50}
                />
              </div>

              {/* Preset Wishes Quick Selector */}
              <div className="form-group">
                <label>Gợi ý lời chúc ngọt ngào (chạm để chọn):</label>
                <div className="preset-wishes">
                  {presetWishList.slice(0, 3).map((w, idx) => (
                    <button
                      key={idx}
                      className="preset-wish-btn"
                      onClick={() => setCustomWish(w)}
                    >
                      {idx + 1}. {w.slice(0, 56)}...
                    </button>
                  ))}
                </div>

                <label>Lời chúc của bạn:</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={customWish}
                  onChange={(e) => setCustomWish(e.target.value)}
                  placeholder="Viết những lời xuất phát từ trái tim..."
                  maxLength={300}
                />
              </div>

              {/* Sender Name */}
              <div className="form-group">
                <label>Người gửi:</label>
                <input
                  className="form-input"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="Tên của bạn..."
                  maxLength={50}
                />
              </div>

              {/* Live Preview Card */}
              <div className="card-preview-container">
                <span className="card-preview-corner corner-tl">
                  <img src="/images/flaticon_flowers/rose.png" alt="" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                </span>
                <span className="card-preview-corner corner-br">
                  <img src="/images/flaticon_flowers/bouquet.png" alt="" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                </span>
                <div className="preview-salutation">Thân gửi {recipient || 'người thương'},</div>
                <p className="preview-body">{customWish}</p>
                <div className="preview-footer">
                  <span>Chúc mừng ngày 20/10!</span>
                  <span>— {sender || 'Người gửi'} ♡</span>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="modal-action-row">
                <button className="btn btn-primary" onClick={handleShareWish}>
                  <Share2 size={16} />
                  <span>Chia sẻ thiệp ngay</span>
                </button>
                <button className="btn btn-secondary" onClick={handleCopyWish}>
                  {copied ? <Check size={16} color="#e63968" /> : <Copy size={16} />}
                  <span>{copied ? 'Đã sao chép!' : 'Sao chép lời chúc'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================
          MODAL: LIGHTBOX XEM ẢNH KỶ NIỆM
          =================================================== */}
      <AnimatePresence>
        {lightboxImg && (
          <div
            className="lightbox-backdrop"
            role="presentation"
            onClick={() => setLightboxImg(null)}
          >
            <motion.div
              className="lightbox-content"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close-btn"
                onClick={() => setLightboxImg(null)}
                aria-label="Đóng ảnh"
              >
                <X size={18} />
              </button>
              <div className="lightbox-img-wrap">
                <img
                  src={lightboxImg.img}
                  alt={lightboxImg.note}
                  className="lightbox-img"
                  loading="eager"
                  onError={(e) => {
                    if (lightboxImg.fallback && e.target.src !== lightboxImg.fallback) {
                      e.target.src = lightboxImg.fallback
                    }
                  }}
                />
              </div>
              <div className="lightbox-caption">{lightboxImg.note} ♡</div>
              <div style={{ marginTop: '16px', position: 'relative', display: 'inline-block' }}>
                <button
                  className="btn btn-primary"
                  onClick={(e) => handleLike(lightboxImg.id, e)}
                  style={{ position: 'relative' }}
                >
                  <Heart size={16} fill="currentColor" />
                  <span>Thả tim ({likesMap[lightboxImg.id]})</span>
                </button>
                {/* Floating hearts popping directly above button on click */}
                {heartPops.filter((p) => p.photoId === lightboxImg.id).map((pop) => (
                  <span
                    key={pop.id}
                    className="floating-heart-pop"
                    style={{ left: `${pop.x}%`, top: '-10px' }}
                  >
                    {pop.emoji}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
