use relm4::prelude::*;

pub struct ProgressbarHorizontal100;

#[relm4::component(pub)]
impl SimpleComponent for ProgressbarHorizontal100 {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::ProgressBar {
            set_fraction: 1.0,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
