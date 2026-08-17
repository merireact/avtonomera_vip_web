import { motion } from "framer-motion";

export default function Transfer() {
  return (
    <div className="mx-auto max-w-4xl pb-16 pt-4 sm:pt-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-2 shadow-sm"
      >
        <img
          src="https://i.postimg.cc/3JjyZX2k/IMG-5699.png"
          alt=""
          className="block h-auto w-full rounded-xl object-cover"
          loading="lazy"
        />
      </motion.div>
    </div>
  );
}
