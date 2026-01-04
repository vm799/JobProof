"use client"

export function SuccessConfetti() {
  return (
    <>
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .confetti {
          position: fixed;
          width: 10px;
          height: 10px;
          background: linear-gradient(135deg, #22d3ee, #3b82f6);
          top: -10px;
          animation: confetti-fall 3s linear infinite;
        }
      `}</style>
    </>
  )
}
