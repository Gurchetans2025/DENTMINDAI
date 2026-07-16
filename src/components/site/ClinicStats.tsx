export default function ClinicStats() {

const stats=[
["5000+","Patients"],
["6+","Years Experience"],
["98%","Success Rate"],
["24/7","AI Support"],
];

return(

<section className="py-24 bg-white">

<div className="mx-auto max-w-7xl grid md:grid-cols-4 gap-8 px-6">

{stats.map(([num,label])=>(

<div
key={label}
className="rounded-2xl bg-[#f8ded0] p-10 text-center"
>

<h3 className="text-5xl font-bold text-[#2f2948]">
{num}
</h3>

<p className="mt-4 text-lg">
{label}
</p>

</div>

))}

</div>

</section>

);

}