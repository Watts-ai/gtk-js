use gtk::prelude::*;
use relm4::prelude::*;

pub struct ImageDefault;

#[relm4::component(pub)]
impl SimpleComponent for ImageDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Image {}
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
