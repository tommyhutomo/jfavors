export const metadata = { title: 'Portfolio – Pastel Events' };

export default function PortfolioPage() {
  const portfolioItems = [
    {
      id: 1,
      title: 'Corporate Conference 2024',
      category: 'Conference',
      description: 'A large-scale corporate conference with 500+ attendees.',
      image: '/portfolio-1.jpg',
    },
    {
      id: 2,
      title: 'Product Launch Event',
      category: 'Product Launch',
      description: 'Exciting product launch event with live demonstrations.',
      image: '/portfolio-2.jpg',
    },
    {
      id: 3,
      title: 'Team Building Retreat',
      category: 'Team Building',
      description: 'Fun and engaging team building activities for 200 employees.',
      image: '/portfolio-3.jpg',
    },
    {
      id: 4,
      title: 'Exhibition & Trade Show',
      category: 'Exhibition',
      description: 'Professional exhibition with vendor booths and networking.',
      image: '/portfolio-4.jpg',
    },
    {
      id: 5,
      title: 'Gala Dinner Event',
      category: 'Gala',
      description: 'Elegant gala dinner with 300 distinguished guests.',
      image: '/portfolio-5.jpg',
    },
    {
      id: 6,
      title: 'Virtual Event Summit',
      category: 'Virtual',
      description: 'Hybrid event combining in-person and virtual attendees.',
      image: '/portfolio-6.jpg',
    },
  ];

  return (
    <div className="pastel-gradient">
      <section className="section container-max">
        <h1 className="heading-1 mb-4">Our Portfolio</h1>
        <p className="subtle max-w-2xl mb-12">
          Explore our impressive collection of events we've successfully executed. From corporate conferences to intimate galas, we bring creativity and expertise to every occasion.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item) => (
            <div key={item.id} className="card overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-pink-200 to-purple-200 h-48 flex items-center justify-center text-gray-400">
                <span className="text-sm">{item.image}</span>
              </div>
              <div className="p-6">
                <div className="inline-block px-3 py-1 bg-brand/10 text-brand text-xs font-semibold rounded-full mb-2">
                  {item.category}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="subtle mb-6">Interested in working with us?</p>
          <a href="/contact" className="btn">Get In Touch</a>
        </div>
      </section>
    </div>
  );
}
