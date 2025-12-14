import services from "../json/services.json";

interface ServiceModal {
  id: number;
  title: string;
  description: string;
  imagePath: string;
}

const Services = () => {
  let allServices: ServiceModal[] = services.services;
  return (
    <div>
      <div className="w-full flex justify-between text-center items-center">
        <h1 className="text-8xl">Our Services</h1>
        <p className="text-2xl">asdasdasd</p>
      </div>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-10">
        {allServices.map((x: ServiceModal) => {
          return (
            <div className="py-4 ">
              <h1 className="font-semibold text-4xl">{x.title}</h1>
              <div className="mt-2 rounded-xl">
                <img src={x.imagePath} alt="logo" className="rounded-xl" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Services;
