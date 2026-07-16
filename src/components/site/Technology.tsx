export default function Technology(){

return(

<section className="py-24 bg-[#faf7fc]">

<div className="mx-auto max-w-6xl px-6">

<h2 className="text-center text-5xl font-bold text-[#2f2948]">
Advanced Dental Technology
</h2>

<div className="mt-16 grid md:grid-cols-3 gap-8">

{[
"AI Smile Analysis",
"Digital X-Ray",
"3D Scanner",
"Laser Dentistry",
"Intra Oral Camera",
"Digital Consultation"
].map(item=>(

<div
key={item}
className="rounded-xl bg-white p-8 shadow"
>

<h3 className="text-2xl font-semibold">
{item}
</h3>

</div>

))}

</div>

</div>

</section>

);

}